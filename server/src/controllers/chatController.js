const {
  Conversations,
  Messages,
  Catalogs,
  Users,
  ConversationParticipant,
  sequelize,
  Sequelize,
} = require('../models');
const controller = require('../socketInit');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/UserNotFoundError');

const USER_ATTRIBUTES = ['id', 'firstName', 'lastName', 'displayName', 'avatar', 'email'];

/**
 * Находит беседу двух пользователей.
 * Раньше это делалось двумя include одной и той же модели Users,
 * что Sequelize не позволяет (коллизия алиасов).
 */
const findConversationBetween = async (userId, interlocutorId, transaction) => {
  const rows = await sequelize.query(
    `SELECT "conversationId"
       FROM "ConversationParticipants"
      WHERE "userId" IN (:ids)
      GROUP BY "conversationId"
     HAVING COUNT(DISTINCT "userId") = 2
        AND COUNT(*) = 2
        AND (
          SELECT COUNT(*)
            FROM "ConversationParticipants" all_participants
           WHERE all_participants."conversationId" = "ConversationParticipants"."conversationId"
        ) = 2
      LIMIT 1`,
    {
      replacements: { ids: [userId, interlocutorId] },
      type: Sequelize.QueryTypes.SELECT,
      transaction,
    },
  );
  if (!rows.length) return null;
  return Conversations.findByPk(rows[0].conversationId, { transaction });
};

const parseInterlocutorId = (req) => {
  const raw = req.body.interlocutorId;
  const id = Number(raw);
  if (!Number.isInteger(id) || id === req.tokenData.userId) return null;
  return id;
};

const toPreview = (conversation, message, interlocutor, participant) => ({
  id: conversation.id,
  conversationId: conversation.id,
  sender: message.sender,
  text: message.body,
  createdAt: message.createdAt,
  blackList: participant.blackList,
  favoriteList: participant.favoriteList,
  interlocutor,
});

module.exports.addMessage = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { userId } = req.tokenData;
    const interlocutorId = parseInterlocutorId(req);
    const { messageBody } = req.body;

    if (!interlocutorId) {
      await t.rollback();
      return next(new BadRequestError('Incorrect interlocutor'));
    }
    if (
      typeof messageBody !== 'string' ||
      !messageBody.trim() ||
      messageBody.length > 5000
    ) {
      await t.rollback();
      return next(new BadRequestError('Message must contain 1 to 5000 characters'));
    }

    const interlocutorUser = await Users.findByPk(interlocutorId, {
      attributes: USER_ATTRIBUTES,
      transaction: t,
    });
    if (!interlocutorUser) {
      await t.rollback();
      return next(new NotFoundError('Interlocutor not found'));
    }
    const senderUser = await Users.findByPk(userId, {
      attributes: USER_ATTRIBUTES,
      transaction: t,
    });
    if (!senderUser) {
      await t.rollback();
      return next(new NotFoundError('User not found'));
    }

    let conversation = await findConversationBetween(userId, interlocutorId, t);

    if (!conversation) {
      conversation = await Conversations.create({}, { transaction: t });
      await ConversationParticipant.bulkCreate(
        [
          { conversationId: conversation.id, userId },
          { conversationId: conversation.id, userId: interlocutorId },
        ],
        { transaction: t },
      );
    }

    const senderParticipant = await ConversationParticipant.findOne({
      where: { conversationId: conversation.id, userId },
      transaction: t,
    });
    const recipientParticipant = await ConversationParticipant.findOne({
      where: { conversationId: conversation.id, userId: interlocutorId },
      transaction: t,
    });
    if (!senderParticipant || !recipientParticipant) {
      await t.rollback();
      return next(new BadRequestError('Conversation participants are invalid'));
    }

    if (senderParticipant.blackList || recipientParticipant.blackList) {
      await t.rollback();
      return next(new BadRequestError('This conversation is blocked'));
    }

    const message = await Messages.create(
      { sender: userId, body: messageBody, conversationId: conversation.id },
      { transaction: t },
    );

    await t.commit();

    // собеседнику в сокет уходит превью, где interlocutor — это отправитель
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: toPreview(conversation, message, senderUser, recipientParticipant),
    });

    res.send({
      message,
      preview: toPreview(conversation, message, interlocutorUser, senderParticipant),
    });
  } catch (err) {
    if (t && !t.finished) await t.rollback();
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const interlocutorId = parseInterlocutorId(req);
    if (!interlocutorId) return next(new BadRequestError('Incorrect interlocutor'));

    const interlocutor = await Users.findByPk(interlocutorId, { attributes: USER_ATTRIBUTES });
    if (!interlocutor) return next(new NotFoundError('Interlocutor not found'));

    const conversation = await findConversationBetween(userId, interlocutorId);

    if (!conversation) {
      // беседы ещё нет — это не ошибка, просто пустой диалог
      return res.send({ messages: [], interlocutor, conversationData: null });
    }

    const messages = await Messages.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']],
    });
    const participant = await ConversationParticipant.findOne({
      where: { conversationId: conversation.id, userId },
    });

    res.send({
      messages,
      interlocutor,
      conversationData: {
        id: conversation.id,
        blackList: participant?.blackList || false,
        favoriteList: participant?.favoriteList || false,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;

    const previews = await sequelize.query(
      `SELECT DISTINCT ON (c."id")
              c."id"            AS "id",
              c."id"            AS "conversationId",
              me."blackList",
              me."favoriteList",
              m."body"          AS "text",
              m."sender",
              m."createdAt",
              other."userId"    AS "interlocutorId"
         FROM "Conversations" c
         JOIN "ConversationParticipants" me
           ON me."conversationId" = c."id" AND me."userId" = :userId
         JOIN "ConversationParticipants" other
           ON other."conversationId" = c."id" AND other."userId" <> :userId
         JOIN "Messages" m ON m."conversationId" = c."id"
        ORDER BY c."id", m."createdAt" DESC`,
      { replacements: { userId }, type: Sequelize.QueryTypes.SELECT },
    );

    const interlocutorIds = previews.map((p) => p.interlocutorId);
    const users = interlocutorIds.length
      ? await Users.findAll({
        where: { id: { [Sequelize.Op.in]: interlocutorIds } },
        attributes: USER_ATTRIBUTES,
      })
      : [];
    const usersById = new Map(users.map((u) => [u.id, u]));

    previews.forEach((preview) => {
      preview.interlocutor = usersById.get(preview.interlocutorId) || null;
    });

    res.send(previews.filter((preview) => preview.interlocutor));
  } catch (err) {
    next(err);
  }
};

const changeConversationFlag = async (req, res, next, field, value) => {
  try {
    const { userId } = req.tokenData;
    if (typeof value !== 'boolean') {
      return next(new BadRequestError('Invalid conversation setting'));
    }
    const interlocutorId = parseInterlocutorId(req);
    if (!interlocutorId) return next(new BadRequestError('Incorrect interlocutor'));

    const conversation = await findConversationBetween(userId, interlocutorId);
    if (!conversation) return next(new NotFoundError('Conversation not found'));

    const participant = await ConversationParticipant.findOne({
      where: { conversationId: conversation.id, userId },
    });
    if (!participant) return next(new NotFoundError('Conversation participant not found'));
    await participant.update({ [field]: value });

    const payload = {
      id: conversation.id,
      conversationId: conversation.id,
      interlocutorId,
      blackList: participant.blackList,
      favoriteList: participant.favoriteList,
    };

    if (field === 'blackList') {
      controller.getChatController().emitChangeBlockStatus(interlocutorId, {
        ...payload,
        interlocutorId: userId,
      });
    }

    res.send(payload);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = (req, res, next) =>
  changeConversationFlag(req, res, next, 'blackList', req.body.blackListFlag);

module.exports.favoriteChat = (req, res, next) =>
  changeConversationFlag(req, res, next, 'favoriteList', req.body.favoriteFlag);

const catalogWithChats = (catalogId, userId) => Catalogs.findOne({
  where: { id: catalogId, userId },
  attributes: ['id', 'catalogName'],
  include: [{
    model: Conversations,
    as: 'chats',
    attributes: ['id'],
    through: { attributes: [] },
  }],
});

const normalizeCatalog = (catalog) => ({
  id: catalog.id,
  catalogName: catalog.catalogName,
  chats: (catalog.chats || []).map((chat) => chat.id),
});

module.exports.createCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogName, chatId } = req.body;
    if (!catalogName) return next(new BadRequestError('Catalog name is required'));

    const catalog = await Catalogs.create({ userId, catalogName });
    if (chatId) await catalog.addChat(chatId);

    res.send(normalizeCatalog(await catalogWithChats(catalog.id, userId)));
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogId, catalogName } = req.body;
    const catalog = await Catalogs.findOne({ where: { id: catalogId, userId } });
    if (!catalog) return next(new NotFoundError('Catalog not found'));

    await catalog.update({ catalogName });
    res.send(normalizeCatalog(await catalogWithChats(catalogId, userId)));
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogId, chatId } = req.body;
    const catalog = await Catalogs.findOne({ where: { id: catalogId, userId } });
    if (!catalog) return next(new NotFoundError('Catalog not found'));

    await catalog.addChat(chatId);
    res.send(normalizeCatalog(await catalogWithChats(catalogId, userId)));
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogId, chatId } = req.body;
    const catalog = await Catalogs.findOne({ where: { id: catalogId, userId } });
    if (!catalog) return next(new NotFoundError('Catalog not found'));

    await catalog.removeChat(chatId);
    res.send(normalizeCatalog(await catalogWithChats(catalogId, userId)));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogId } = req.body;
    await Catalogs.destroy({ where: { id: catalogId, userId } });
    res.send({ catalogId });
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const catalogs = await Catalogs.findAll({
      where: { userId },
      attributes: ['id', 'catalogName'],
      include: [{
        model: Conversations,
        as: 'chats',
        attributes: ['id'],
        through: { attributes: [] },
      }],
    });
    res.send(catalogs.map(normalizeCatalog));
  } catch (err) {
    next(err);
  }
};
