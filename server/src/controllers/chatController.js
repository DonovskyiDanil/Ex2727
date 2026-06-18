const {
  Conversation,
  Message,
  Catalog,
  Users,
  sequelize,
} = require('../models');
const controller = require('../socketInit');

module.exports.addMessage = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      userId,
      firstName,
      lastName,
      displayName,
      avatar,
      email,
    } = req.tokenData;
    const { interlocutorId, messageBody, interlocutor } = req.body;

    let conversation = await Conversation.findOne({
      include: [
        {
          model: Users,
          through: { where: { userId } },
          attributes: ['id'],
        },
        {
          model: Users,
          through: { where: { userId: interlocutorId } },
          attributes: ['id'],
        },
      ],
      transaction: t,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        favoriteList: false,
        blackList: false,
      }, { transaction: t });

      await conversation.addUser(userId, {
        through: { conversationId: conversation.id, userId },
        transaction: t,
      });
      await conversation.addUser(interlocutorId, {
        through: { conversationId: conversation.id, userId: interlocutorId },
        transaction: t,
      });
    }

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
      blackList: conversation.blackList,
      favoriteList: conversation.favoriteList,
    };

    const interlocutorData = {
      id: userId,
      firstName,
      lastName,
      displayName,
      avatar,
      email,
    };

    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: Object.assign({}, preview, {
        interlocutor: interlocutorData,
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

    const conversation = await Conversation.findOne({
      include: [
        {
          model: Users,
          through: { where: { userId } },
          attributes: ['id'],
        },
        {
          model: Users,
          through: { where: { userId: interlocutorId } },
          attributes: ['id'],
        },
      ],
    });

    if (!conversation) {
      return res.send({ messages: [], interlocutor: null });
    }

    const messages = await Message.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']],
    });

    const foundInterlocutor = await Users.findByPk(interlocutorId, {
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    res.send({ messages, interlocutor: foundInterlocutor });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    // Убран повторный require моделей, так как они уже есть в верхней части файла

    const conversations = await sequelize.query(
      `SELECT DISTINCT ON ("Messages"."conversationId") 
      "Messages"."id", "Messages"."body" as "text", "Messages"."sender", "Messages"."createdAt", 
      "Conversations"."id" as "conversationId", "Conversations"."blackList", "Conversations"."favoriteList", 
      "ConversationParticipants"."userId" as "interlocutorId" 
      FROM "Messages" 
      JOIN "Conversations" ON "Messages"."conversationId" = "Conversations"."id" 
      JOIN "ConversationParticipants" ON "ConversationParticipants"."conversationId" = "Conversations"."id" 
      WHERE "ConversationParticipants"."userId" = :userId 
      ORDER BY "Messages"."conversationId", "Messages"."createdAt" DESC`,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    for (let i = 0; i < conversations.length; i += 1) {
      const conv = conversations[i];
      const sender = await Users.findByPk(conv.interlocutorId, {
        attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
      });
      conv.interlocutor = sender;
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
    const { interlocutorId, blackListFlag } = req.body;

    const conversation = await Conversation.findOne({
      include: [
        {
          model: Users,
          through: { where: { userId } },
          attributes: ['id'],
        },
        {
          model: Users,
          through: { where: { userId: interlocutorId } },
          attributes: ['id'],
        },
      ],
    });

    if (!conversation) {
      return res.status(404).send('Conversation not found');
    }

    await conversation.update({ blackList: blackListFlag });

    controller.getChatController().emitChangeBlockStatus(interlocutorId, conversation);

    res.send(conversation);
  } catch (err) {
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;
    const { interlocutorId, favoriteFlag } = req.body;

    const conversation = await Conversation.findOne({
      include: [
        {
          model: Users,
          through: { where: { userId } },
          attributes: ['id'],
        },
        {
          model: Users,
          through: { where: { userId: interlocutorId } },
          attributes: ['id'],
        },
      ],
    });

    if (!conversation) {
      return res.status(404).send('Conversation not found');
    }

    await conversation.update({ favoriteList: favoriteFlag });
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
