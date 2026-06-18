const db = require('../models');
const nodemailer = require('nodemailer');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-password',
  },
});

// --- МЕТОДЫ ДЛЯ МОДЕРАТОРА ---

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

module.exports.changeOfferStatus = async (req, res, next) => {
  try {
    const { offerId, command } = req.body;
    const status = command === 'approve'
      ? CONSTANTS.OFFER_STATUS_APPROVED
      : CONSTANTS.OFFER_STATUS_REJECTED;

    const [updatedCount] = await db.Offers.update(
      { status },
      { where: { id: offerId } },
    );

    if (updatedCount === 0) {
      return next(new ServerError('Offer not found'));
    }

    const offer = await db.Offers.findOne({
      where: { id: offerId },
      include: [
        { model: db.Contests, attributes: ['title'] },
        { model: db.Users, attributes: ['email', 'displayName'] },
      ],
    });

    try {
      const creativeEmail = offer.User ? offer.User.email : null;
      const creativeName = offer.User ? (offer.User.displayName || 'Creative') : 'Creative';
      const contestTitle = offer.Contest ? offer.Contest.title : 'Contest';
      const subject = command === 'approve'
        ? `Your offer was approved for "${contestTitle}"`
        : `Your offer was rejected for "${contestTitle}"`;
      const message = command === 'approve'
        ? `Great news, ${creativeName}! Your offer for the contest "${contestTitle}" has been approved.`
        : `Hello ${creativeName}, unfortunately your offer for "${contestTitle}" was not approved.`;

      if (creativeEmail) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'noreply@squadhelp.com',
          to: creativeEmail,
          subject,
          text: `${message}\n\nThank you for participating!`,
          html: `<h2>${subject}</h2><p>${message}</p><p>Thank you for participating!</p>`,
        });
      }
    } catch (emailErr) {
      console.error('Error sending email notification:', emailErr.message);
    }

    res.send(offer);
  } catch (err) {
    next(new ServerError(`Error updating status: ${err.message}`));
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

// ВИПРАВЛЕНО: Кастомер тепер бачить лише оффери зі статусом 'approved' або 'won'
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
          where: {
            status: { [db.Sequelize.Op.or]: [CONSTANTS.OFFER_STATUS_APPROVED, CONSTANTS.OFFER_STATUS_WON] },
          },
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

// ВИПРАВЛЕНО: Чіткий розподіл дій модератора (approve -> approved) та кастомера (resolve -> won)
module.exports.setOfferStatus = async (req, res, next) => {
  try {
    const { command, offerId, contestId } = req.body;

    if (!offerId || !command || !contestId) {
      return next(new ServerError('Missing required fields'));
    }

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

    const [updatedCount] = await db.Offers.update(
      { status: newStatus },
      { where: { id: offerId, status: { [db.Sequelize.Op.ne]: newStatus } } },
    );

    if (updatedCount === 0) {
      const existingOffer = await db.Offers.findOne({ where: { id: offerId } });
      if (!existingOffer) return next(new ServerError('Offer not found'));
      if (existingOffer.status === newStatus) return res.send(existingOffer);
      return next(new ServerError(`Cannot change status to ${newStatus}`));
    }

    if (command === 'resolve') {
      await db.Offers.update(
        { status: CONSTANTS.OFFER_STATUS_REJECTED },
        { where: { contestId, id: { [db.Sequelize.Op.ne]: offerId } } },
      );
      await db.Contests.update(
        { status: CONSTANTS.CONTEST_STATUS_FINISHED },
        { where: { id: contestId } },
      );
    }

    const updatedOffer = await db.Offers.findOne({
      where: { id: offerId },
      include: [{ model: db.Users, attributes: { exclude: ['password'] } }],
    });

    const socketInit = require('../socketInit');
    const notificationController = socketInit.getNotificationController();
    if (notificationController) {
      notificationController.emitChangeOfferStatus(contestId, notificationMessage, contestId);
    }

    res.send(updatedOffer);
  } catch (err) {
    next(new ServerError(`Error updating offer status: ${err.message}`));
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
    const predicates = UtilFunctions.createWhereForAllContests(
      req.body.typeIndex,
      req.body.contestId,
      req.body.industry,
      req.body.awardSort,
    );
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
    const updatedContest = await contestQueries.updateContest(req.body, {
      id: req.body.contestId,
      userId: req.tokenData.userId,
    });
    res.send(updatedContest);
  } catch (err) {
    next(err);
  }
};

module.exports.downloadFile = async (req, res) => {
  const filePath = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
  res.download(filePath);
};
