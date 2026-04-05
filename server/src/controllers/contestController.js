const db = require('../models');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');

// Получение данных для формы конкурса
module.exports.dataForContest = async (req, res, next) => {
  try {
    const { characteristic1, characteristic2 } = req.body;
    const types = [characteristic1, characteristic2, 'industry'].filter(Boolean);

    const characteristics = await db.Selects.findAll({
      where: { type: { [db.Sequelize.Op.or]: types } },
    });

    if (!characteristics) return next(new ServerError());

    const response = {};
    characteristics.forEach(c => {
      if (!response[c.type]) response[c.type] = [];
      response[c.type].push(c.describe);
    });

    res.send(response);
  } catch (err) {
    next(err);
  }
};

// Получение информации о конкретном конкурсе
module.exports.getContestById = async (req, res, next) => {
  try {
    let contest = await db.Contests.findOne({
      where: { id: req.headers.contestid },
      order: [[db.Offers, 'id', 'asc']],
      include: [
        {
          model: db.Users,
          required: true,
          attributes: { exclude: ['password', 'role', 'balance', 'accessToken'] },
        },
        {
          model: db.Offers,
          required: false,
          where: req.tokenData.role === CONSTANTS.CREATOR ? { userId: req.tokenData.userId } : {},
          attributes: { exclude: ['userId', 'contestId'] },
          include: [
            {
              model: db.Users,
              required: true,
              attributes: { exclude: ['password', 'role', 'balance', 'accessToken'] },
            },
            {
              model: db.Ratings,
              required: false,
              where: { userId: req.tokenData.userId },
              attributes: { exclude: ['userId', 'offerId'] },
            },
          ],
        },
      ],
    });

    if (!contest) return next(new ServerError('Contest not found'));

    contest = contest.get({ plain: true });
    contest.Offers.forEach(offer => {
      if (offer.Rating) offer.mark = offer.Rating.mark;
      delete offer.Rating;
    });

    res.send(contest);
  } catch (err) {
    next(new ServerError());
  }
};

// Скачивание файла конкурса
module.exports.downloadFile = async (req, res, next) => {
  const { fileName } = req.params;
  if (!fileName || fileName.includes('..') || fileName.includes('/')) {
    return next(new ServerError('Invalid file name'));
  }

  const filePath = CONSTANTS.CONTESTS_DEFAULT_DIR + fileName;
  res.download(filePath, err => {
    if (err) next(new ServerError('File not found'));
  });
};

// Обновление конкурса
module.exports.updateContest = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.fileName = req.file.filename;
      req.body.originalFileName = req.file.originalname;
    }
    const contestId = req.body.contestId;
    delete req.body.contestId;

    const updatedContest = await contestQueries.updateContest(req.body, {
      id: contestId,
      userId: req.tokenData.userId,
    });

    res.send(updatedContest);
  } catch (err) {
    next(err);
  }
};

// Добавление нового предложения
module.exports.setNewOffer = async (req, res, next) => {
  try {
    const obj = {
      userId: req.tokenData.userId,
      contestId: req.body.contestId,
    };

    if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
      obj.fileName = req.file.filename;
      obj.originalFileName = req.file.originalname;
    } else {
      obj.text = req.body.offerData;
    }

    const result = await contestQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;

    controller.getNotificationController().emitEntryCreated(req.body.customerId);
    const User = { ...req.tokenData, id: req.tokenData.userId };

    res.send({ ...result, User });
  } catch (err) {
    next(new ServerError());
  }
};

// Локальные функции для обработки статуса предложений
const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejected = await contestQueries.updateOffer(
    { status: CONSTANTS.OFFER_STATUS_REJECTED },
    { id: offerId }
  );
  controller.getNotificationController().emitChangeOfferStatus(
    creatorId,
    'Someone of your offers was rejected',
    contestId
  );
  return rejected;
};

const resolveOffer = async (contestId, creatorId, orderId, offerId, priority, transaction) => {
  const finishedContest = await contestQueries.updateContestStatus(
    {
      status: db.sequelize.literal(`
        CASE
          WHEN "id"=${contestId} AND "orderId"='${orderId}' THEN '${CONSTANTS.CONTEST_STATUS_FINISHED}'
          WHEN "orderId"='${orderId}' AND "priority"=${priority + 1} THEN '${CONSTANTS.CONTEST_STATUS_ACTIVE}'
          ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}'
        END
      `),
    },
    { orderId },
    transaction
  );

  await userQueries.updateUser(
    { balance: db.sequelize.literal('balance + ' + finishedContest.prize) },
    creatorId,
    transaction
  );

  const updatedOffers = await contestQueries.updateOfferStatus(
    {
      status: db.sequelize.literal(`
        CASE
          WHEN "id"=${offerId} THEN '${CONSTANTS.OFFER_STATUS_WON}'
          ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}'
        END
      `),
    },
    { contestId },
    transaction
  );

  await transaction.commit();

  const arrayRoomsId = updatedOffers
    .filter(o => o.status === CONSTANTS.OFFER_STATUS_REJECTED && creatorId !== o.userId)
    .map(o => o.userId);

  controller.getNotificationController().emitChangeOfferStatus(arrayRoomsId, 'Someone of your offers was rejected', contestId);
  controller.getNotificationController().emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);

  return updatedOffers[0].dataValues;
};

// Установка статуса предложения (reject/resolve)
module.exports.setOfferStatus = async (req, res, next) => {
  let transaction;
  try {
    if (req.body.command === 'reject') {
      const offer = await rejectOffer(req.body.offerId, req.body.creatorId, req.body.contestId);
      return res.send(offer);
    }

    if (req.body.command === 'resolve') {
      transaction = await db.sequelize.transaction();
      const winningOffer = await resolveOffer(
        req.body.contestId,
        req.body.creatorId,
        req.body.orderId,
        req.body.offerId,
        req.body.priority,
        transaction
      );
      return res.send(winningOffer);
    }

    return next(new ServerError('Unknown command'));
  } catch (err) {
    if (transaction) await transaction.rollback();
    next(err);
  }
};

// Получение конкурсов клиента
module.exports.getCustomersContests = async (req, res, next) => {
  try {
    const contests = await db.Contests.findAll({
      where: { status: req.headers.status, userId: req.tokenData.userId },
      limit: req.body.limit,
      offset: req.body.offset || 0,
      order: [['id', 'DESC']],
      include: [{ model: db.Offers, required: false, attributes: ['id'] }],
    });

    contests.forEach(c => (c.dataValues.count = c.dataValues.Offers.length));
    const haveMore = contests.length > 0;

    res.send({ contests, haveMore });
  } catch (err) {
    next(new ServerError(err));
  }
};

// Получение всех конкурсов
module.exports.getContests = async (req, res, next) => {
  try {
    const predicates = UtilFunctions.createWhereForAllContests(
      req.body.typeIndex,
      req.body.contestId,
      req.body.industry,
      req.body.awardSort
    );

    const contests = await db.Contests.findAll({
      where: predicates.where,
      order: predicates.order,
      limit: req.body.limit,
      offset: req.body.offset || 0,
      include: [
        {
          model: db.Offers,
          required: req.body.ownEntries,
          where: req.body.ownEntries ? { userId: req.tokenData.userId } : {},
          attributes: ['id'],
        },
      ],
    });

    contests.forEach(c => (c.dataValues.count = c.dataValues.Offers.length));
    const haveMore = contests.length > 0;

    res.send({ contests, haveMore });
  } catch (err) {
    next(new ServerError());
  }
};
