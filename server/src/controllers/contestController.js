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
    const contest = await db.Contests.findOne({
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
  } catch (err) {
    next(new ServerError());
  }
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
    const { command, offerId, creatorId, orderId, priority, contestId } = req.body;

    // Validate required fields
    if (!offerId || !command || !contestId) {
      return next(new ServerError('Missing required fields: offerId, command, contestId'));
    }

    // Determine new status based on command:
    // - 'approve' (from moderator) -> 'approved' (moderator approved, waiting for customer)
    // - 'resolve' (from customer) -> 'won' (customer selected this offer)
    // - 'reject' -> 'rejected'
    let newStatus;
    let notificationMessage;

    if (command === 'approve') {
      newStatus = CONSTANTS.OFFER_STATUS_APPROVED;
      notificationMessage = 'Offer approved by moderator';
    } else if (command === 'resolve') {
      newStatus = CONSTANTS.OFFER_STATUS_WON;
      notificationMessage = 'Offer accepted by customer';
    } else {
      newStatus = CONSTANTS.OFFER_STATUS_REJECTED;
      notificationMessage = 'Offer rejected';
    }

    // Update the offer status
    const [updatedCount] = await db.Offers.update(
      { status: newStatus },
      { where: { id: offerId, status: { [db.Sequelize.Op.ne]: newStatus } } },
    );

    // If no rows updated, check if offer exists and already has the target status
    if (updatedCount === 0) {
      const existingOffer = await db.Offers.findOne({ where: { id: offerId } });
      if (!existingOffer) {
        return next(new ServerError('Offer not found'));
      }
      // Offer already has the same status - this is okay, just return it
      if (existingOffer.status === newStatus) {
        return res.send(existingOffer);
      }
      // Offer has a different status that can't be changed to this status
      return next(new ServerError('Cannot change offer status from ' + existingOffer.status + ' to ' + newStatus));
    }

    // If customer resolves (selects winner), reject all other offers and finish contest
    if (command === 'resolve') {
      await db.Offers.update(
        { status: CONSTANTS.OFFER_STATUS_REJECTED },
        { where: { contestId, id: { [db.Sequelize.Op.ne]: offerId } } },
      );

      // Update contest status to finished
      await db.Contests.update(
        { status: CONSTANTS.CONTEST_STATUS_FINISHED },
        { where: { id: contestId } },
      );
    }

    // Get updated offer to return
    const updatedOffer = await db.Offers.findOne({
      where: { id: offerId },
      include: [{ model: db.Users, attributes: { exclude: ['password'] } }],
    });

    // Emit WebSocket notification to all subscribers of this contest
    const notificationController = require('../socketInit').getNotificationController();
    if (notificationController) {
      notificationController.emitChangeOfferStatus(
        contestId,
        notificationMessage,
        contestId,
      );
    }

    res.send(updatedOffer);
  } catch (err) {
    console.error('Error in setOfferStatus:', err);
    next(new ServerError('Error updating offer status: ' + err.message));
  }
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
  } catch (err) {
    next(new ServerError(err));
  }
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
  } catch (err) {
    next(new ServerError());
  }
};

module.exports.updateContest = async (req, res, next) => {
  try {
    const updatedContest = await contestQueries.updateContest(req.body, { id: req.body.contestId, userId: req.tokenData.userId });
    res.send(updatedContest);
  } catch (err) {
    next(err);
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const filePath = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
  res.download(filePath);
};
