const { Conversation, Message, Catalog, Users, sequelize } = require('../models');
const controller = require('../socketInit');

module.exports.addMessage = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { userId, firstName, lastName, displayName, avatar, email } = req.tokenData;
    const { interlocutorId, messageBody, interlocutor } = req.body;
    const participants = [userId, interlocutorId].sort((a, b) => a - b);

    const [conversation] = await Conversation.findOrCreate({
      where: {
        participant1: participants[0],
        participant2: participants[1],
      },
      defaults: {
        participant1: participants[0],
        participant2: participants[1],
        blackList: [false, false],
        favoriteList: [false, false],
      },
      transaction: t,
    });

    const message = await Message.create({
      sender: userId,
      body: messageBody,
      conversationId: conversation.id,
    }, { transaction: t });

    await t.commit();

    const preview = {
      id: conversation.id,
      sender: userId,
      text: messageBody,
      createdAt: message.createdAt,
      participants,
      blackList: conversation.blackList,
      favoriteList: conversation.favoriteList,
    };

    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: Object.assign({}, preview, {
        interlocutor: {
          id: userId,
          firstName,
          lastName,
          displayName,
          avatar,
          email,
        },
      }),
    });

    res.send({
      message,
      preview: Object.assign({}, preview, { interlocutor }),
    });
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { interlocutorId } = req.body;
    const participants = [userId, interlocutorId].sort((a, b) => a - b);

    const messages = await Message.findAll({
      include: [{
        model: Conversation,
        as: 'conversation',
        where: {
          participant1: participants[0],
          participant2: participants[1],
        },
        attributes: [],
      }],
      order: [['createdAt', 'ASC']],
    });

    const interlocutor = await Users.findByPk(interlocutorId, {
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    res.send({ messages, interlocutor });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;

    const conversations = await sequelize.query(
      'SELECT DISTINCT ON ("Messages"."conversationId") ' +
      '"Messages"."id", "Messages"."body" as "text", "Messages"."sender", "Messages"."createdAt", ' +
      '"Conversations"."id" as "conversationId", "Conversations"."participant1", ' +
      '"Conversations"."participant2", "Conversations"."blackList", "Conversations"."favoriteList" ' +
      'FROM "Messages" ' +
      'JOIN "Conversations" ON "Messages"."conversationId" = "Conversations"."id" ' +
      'WHERE "Conversations"."participant1" = :userId OR "Conversations"."participant2" = :userId ' +
      'ORDER BY "Messages"."conversationId", "Messages"."createdAt" DESC',
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    for (let i = 0; i < conversations.length; i += 1) {
      const conv = conversations[i];
      const interlocutorId = conv.participant1 === userId ? conv.participant2 : conv.participant1;
      const sender = await Users.findByPk(interlocutorId, {
        attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
      });
      conv.interlocutor = sender;
      conv.participants = [conv.participant1, conv.participant2];
      conv.id = conv.conversationId;
    }

    res.send(conversations);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { participants, blackListFlag } = req.body;
    const sortedParticipants = participants.sort((a, b) => a - b);
    const userIndex = sortedParticipants.indexOf(userId);

    const conversation = await Conversation.findOne({
      where: { participant1: sortedParticipants[0], participant2: sortedParticipants[1] },
    });

    const newBlackList = [conversation.blackList[0], conversation.blackList[1]];
    newBlackList[userIndex] = blackListFlag;

    await conversation.update({ blackList: newBlackList });

    const interlocutorId = sortedParticipants.find((id) => id !== userId);
    controller.getChatController().emitChangeBlockStatus(interlocutorId, conversation);

    res.send(conversation);
  } catch (err) {
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { participants, favoriteFlag } = req.body;
    const sortedParticipants = participants.sort((a, b) => a - b);
    const userIndex = sortedParticipants.indexOf(userId);

    const conversation = await Conversation.findOne({
      where: { participant1: sortedParticipants[0], participant2: sortedParticipants[1] },
    });

    const newFavoriteList = [conversation.favoriteList[0], conversation.favoriteList[1]];
    newFavoriteList[userIndex] = favoriteFlag;

    await conversation.update({ favoriteList: newFavoriteList });
    res.send(conversation);
  } catch (err) {
    next(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogName, chatId } = req.body;
    const catalog = await Catalog.create({
      userId,
      catalogName,
    });
    await catalog.addChat(chatId);
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogId, catalogName } = req.body;
    const catalog = await Catalog.findOne({
      where: { id: catalogId, userId },
    });
    await catalog.update({ catalogName });
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogId, chatId } = req.body;
    const catalog = await Catalog.findOne({
      where: { id: catalogId, userId },
    });
    await catalog.addChat(chatId);
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogId, chatId } = req.body;
    const catalog = await Catalog.findOne({
      where: { id: catalogId, userId },
    });
    await catalog.removeChat(chatId);
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { catalogId } = req.body;
    await Catalog.destroy({
      where: { id: catalogId, userId },
    });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const catalogs = await Catalog.findAll({
      where: { userId },
      attributes: ['id', 'catalogName'],
      include: [{
        model: Conversation,
        as: 'chats',
        attributes: ['id'],
        through: { attributes: [] },
      }],
    });
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};
