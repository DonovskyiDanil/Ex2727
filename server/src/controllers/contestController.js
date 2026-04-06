const db = require('../models');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');

// --- МЕТОДЫ ДЛЯ МОДЕРАТОРА ---

// 1. Получение предложений для модерации
module.exports.getOffersModeration = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const offers = await db.Offers.findAndCountAll({
      limit: limit || 10,
      offset: offset || 0,
      where: { status: CONSTANTS.OFFER_STATUS_PENDING },
      include: [
        {
          model: db.Contests,
          required: true,
          attributes: ['title', 'industry', 'contestType'],
        },
      ],
      order: [['id', 'DESC']],
    });
    res.send(offers);
  } catch (err) {
    next(new ServerError('Error fetching offers'));
  }
};

// 2. Изменение статуса модератором
module.exports.changeOfferStatus = async (req, res, next) => {
  try {
    const { offerId, command } = req.body;
    // Use 'won' for approve, 'rejected' for reject
    const status = command === 'approve'
      ? CONSTANTS.OFFER_STATUS_WON
      : CONSTANTS.OFFER_STATUS_REJECTED;

    const [updatedCount] = await db.Offers.update(
      { status },
      { where: { id: offerId } }
    );

    if (updatedCount === 0) {
      return next(new ServerError('Offer not found'));
    }

    // Get the updated offer
    const offer = await db.Offers.findOne({ where: { id: offerId } });
    res.send(offer);
  } catch (err) {
    console.error('Error in changeOfferStatus:', err);
    next(new ServerError('Error updating status: ' + err.message));
  }
};

// --- ОСТАЛЬНЫЕ МЕТОДЫ ---

module.exports.dataForContest = async (req, res, next) => {
  try {
    const { characteristic1, characteristic2 } = req.body;
    const types = [characteristic1, characteristic2, 'industry'].filter(Boolean);
    const characteristics = await db.Selects.findAll({
      where: { type: { [db.Sequelize.Op.or]: types } },
    });
    const response = {};
    characteristics.forEach(c => {
      if (!response[c.type]) response[c.type] = [];
      response[c.type].push(c.describe);
    });
    res.send(response);
  } catch (err) { next(err); }
};

module.exports.getContestById = async (req, res, next) => {
  try {
    let contest = await db.Contests.findOne({
      where: { id: req.headers.contestid },
      order: [[db.Offers, 'id', 'asc']],
      include: [
        { model: db.Users, required: true, attributes: { exclude: ['password'] } },
        {
          model: db.Offers,
          required: false,
          include: [{ model: db.Users, required: true, attributes: { exclude: ['password'] } }],
        },
      ],
    });
    res.send(contest);
  } catch (err) { next(new ServerError()); }
};

module.exports.setNewOffer = async (req, res, next) => {
  try {
    const obj = { userId: req.tokenData.userId, contestId: req.body.contestId };
    if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
      obj.fileName = req.file.filename;
      obj.originalFileName = req.file.originalname;
    } else {
      obj.text = req.body.offerData;
    }
    const result = await contestQueries.createOffer(obj);
    const user = Object.assign({}, req.tokenData, { id: req.tokenData.userId });
    res.send(Object.assign({}, result, { User: user }));
  } catch (err) { next(new ServerError()); }
};

module.exports.setOfferStatus = async (req, res, next) => {
  try {
    // Логика клиента (resolve/reject)
    res.send({ message: "Status updated" });
  } catch (err) { next(err); }
};

module.exports.getCustomersContests = async (req, res, next) => {
  try {
    const contests = await db.Contests.findAll({
      where: { status: req.headers.status, userId: req.tokenData.userId },
      limit: req.body.limit,
      offset: req.body.offset || 0,
      order: [['id', 'DESC']],
    });
    res.send({ contests, haveMore: contests.length > 0 });
  } catch (err) { next(new ServerError(err)); }
};

module.exports.getContests = async (req, res, next) => {
  try {
    const predicates = UtilFunctions.createWhereForAllContests(req.body.typeIndex, req.body.contestId, req.body.industry, req.body.awardSort);
    const contests = await db.Contests.findAll({
      where: predicates.where,
      order: predicates.order,
      limit: req.body.limit,
      offset: req.body.offset || 0,
    });
    res.send({ contests, haveMore: contests.length > 0 });
  } catch (err) { next(new ServerError()); }
};

module.exports.updateContest = async (req, res, next) => {
  try {
    const updatedContest = await contestQueries.updateContest(req.body, { id: req.body.contestId, userId: req.tokenData.userId });
    res.send(updatedContest);
  } catch (err) { next(err); }
};

module.exports.downloadFile = async (req, res, next) => {
  const filePath = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
  res.download(filePath);
};
