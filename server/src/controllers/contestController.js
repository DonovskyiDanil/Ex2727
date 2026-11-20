const db = require('../models');
const path = require('path');
const nodemailer = require('nodemailer');
const contestQueries = require('./queries/contestQueries');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');
const BadRequestError = require('../errors/BadRequestError');
const RightsError = require('../errors/RightsError');

const createEmailTransporter = () => {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
};

// --- МЕТОДЫ ДЛЯ МОДЕРАТОРА ---

module.exports.getOffersModeration = async (req, res, next) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedOffset = Number.parseInt(req.query.offset, 10);
    const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 50) : 10;
    const offset = Number.isInteger(parsedOffset) ? Math.max(parsedOffset, 0) : 0;
    const offers = await db.Offers.findAndCountAll({
      limit,
      offset,
      attributes: ['id', 'text', 'fileName', 'originalFileName', 'status', 'contestId'],
      where: { status: CONSTANTS.OFFER_STATUS_PENDING },
      include: [
        {
          model: db.Contests,
          required: true,
          attributes: [
            'title',
            'industry',
            'contestType',
            'styleName',
            'typeOfName',
            'typeOfTagline',
            'brandStyle',
          ],
        },
      ],
      order: [['id', 'DESC']],
    });
    res.send(offers);
  } catch (err) {
    next(err);
  }
};

module.exports.changeOfferStatus = async (req, res, next) => {
  try {
    const { offerId, command } = req.body;
    const parsedOfferId = Number(offerId);
    if (!Number.isInteger(parsedOfferId) || !['approve', 'reject'].includes(command)) {
      return next(new BadRequestError('Invalid moderation request'));
    }

    const offer = await db.Offers.findOne({
      where: { id: parsedOfferId, status: CONSTANTS.OFFER_STATUS_PENDING },
      include: [
        { model: db.Contests, attributes: ['id', 'title'] },
        { model: db.Users, attributes: ['email', 'displayName'] },
      ],
    });
    if (!offer) return next(new BadRequestError('Offer not found or already moderated'));

    const status = command === 'approve'
      ? CONSTANTS.OFFER_STATUS_APPROVED
      : CONSTANTS.OFFER_STATUS_REJECTED;
    const [updatedCount] = await db.Offers.update(
      { status },
      { where: { id: parsedOfferId, status: CONSTANTS.OFFER_STATUS_PENDING } },
    );
    if (updatedCount !== 1) {
      return next(new BadRequestError('Offer was already moderated'));
    }

    const transporter = createEmailTransporter();
    let notification = { sent: false, reason: 'SMTP is not configured' };
    if (transporter && offer.User?.email) {
      const contestTitle = offer.Contest?.title || 'Contest';
      const subject = command === 'approve'
        ? `Your offer was approved for "${contestTitle}"`
        : `Your offer was rejected for "${contestTitle}"`;
      const creativeName = offer.User.displayName || 'Creative';
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: offer.User.email,
          subject,
          text: command === 'approve'
            ? `Great news, ${creativeName}! Your offer for the contest "${contestTitle}" has been approved.`
            : `Hello ${creativeName}, your offer for "${contestTitle}" was not approved.`,
        });
        notification = { sent: true };
      } catch (emailErr) {
        console.error('Offer status updated but email notification failed:', emailErr.message);
        notification = { sent: false, reason: 'Email delivery failed' };
      }
    } else {
      console.warn('Offer status updated without an email notification: SMTP is not configured');
    }

    res.send({
      offer: {
        id: offer.id,
        status,
        contestId: offer.contestId,
      },
      notification,
    });
  } catch (err) {
    next(err);
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
    const { role, userId } = req.tokenData;
    const contestId = Number.parseInt(req.headers.contestid, 10);
    if (!Number.isInteger(contestId)) {
      return next(new BadRequestError('contestId is required'));
    }
    let offersWhere;
    const contestWhere = { id: contestId };
    if (role === CONSTANTS.CREATOR) {
      contestWhere.status = {
        [db.Sequelize.Op.or]: [
          CONSTANTS.CONTEST_STATUS_ACTIVE,
          CONSTANTS.CONTEST_STATUS_FINISHED,
        ],
      };
      offersWhere = { userId };
    } else if (role === CONSTANTS.CUSTOMER) {
      contestWhere.userId = userId;
      offersWhere = {
        status: {
          [db.Sequelize.Op.or]: [
            CONSTANTS.OFFER_STATUS_APPROVED,
            CONSTANTS.OFFER_STATUS_WON,
          ],
        },
      };
    } else {
      return next(new RightsError('Not allowed'));
    }

    const contest = await db.Contests.findOne({
      where: contestWhere,
      order: [[db.Offers, 'id', 'asc']],
      include: [
        {
          model: db.Users,
          required: true,
          attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
        },
        {
          model: db.Offers,
          required: false,
          ...(offersWhere ? { where: offersWhere } : {}),
          include: [{
            model: db.Users,
            required: true,
            attributes: ['id', 'firstName', 'lastName', 'displayName', 'email', 'avatar', 'rating'],
          }],
        },
      ],
    });

    if (!contest) return next(new BadRequestError('Contest not found'));

    const contestData = contest.get({ plain: true });
    if (role === CONSTANTS.CUSTOMER && contestData.Offers?.length) {
      const ratings = await db.Ratings.findAll({
        attributes: ['offerId', 'mark'],
        where: {
          userId,
          offerId: {
            [db.Sequelize.Op.in]: contestData.Offers.map((offer) => offer.id),
          },
        },
        raw: true,
      });
      const ratingsByOfferId = new Map(
        ratings.map((rating) => [rating.offerId, rating.mark]),
      );
      contestData.Offers = contestData.Offers.map((offer) => ({
        ...offer,
        mark: ratingsByOfferId.get(offer.id) || 0,
      }));
    }

    res.send(contestData);
  } catch (err) {
    next(err);
  }
};

module.exports.setNewOffer = async (req, res, next) => {
  try {
    const contestId = Number.parseInt(req.body.contestId, 10);
    if (!Number.isInteger(contestId)) {
      return next(new BadRequestError('contestId is required'));
    }

    const contest = await db.Contests.findOne({ where: { id: contestId } });
    if (!contest) return next(new BadRequestError('Contest not found'));
    if (contest.status !== CONSTANTS.CONTEST_STATUS_ACTIVE) {
      return next(new BadRequestError('Contest is not active'));
    }

    const obj = { userId: req.tokenData.userId, contestId };

    if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
      if (!req.file) return next(new BadRequestError('Logo file is required'));
      obj.fileName = req.file.filename;
      obj.originalFileName = req.file.originalname;
    } else {
      const text = (req.body.offerData || '').trim();
      if (!text) return next(new BadRequestError('Offer text is required'));
      obj.text = text;
    }

    const offer = await contestQueries.createOffer(obj);

    // Отдаём клиенту нормальный объект оффера с автором,
    // а не сырой tokenData, у которого нет ни rating, ни id.
    const author = await db.Users.findByPk(req.tokenData.userId, {
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'email', 'avatar', 'rating'],
    });

    res.send({
      ...offer,
      status: offer.status || CONSTANTS.OFFER_STATUS_PENDING,
      User: author ? author.get({ plain: true }) : null,
    });
  } catch (err) {
    next(err);
  }
};

// ВИПРАВЛЕНО: Чіткий розподіл дій модератора (approve -> approved) та кастомера (resolve -> won)
module.exports.setOfferStatus = async (req, res, next) => {
  let transaction;
  try {
    const { command, offerId, contestId } = req.body;
    const parsedOfferId = Number(offerId);
    const parsedContestId = Number(contestId);
    if (!Number.isInteger(parsedOfferId) || !Number.isInteger(parsedContestId)) {
      return next(new BadRequestError('Invalid offer status request'));
    }

    transaction = await db.sequelize.transaction();
    const contest = await db.Contests.findByPk(parsedContestId, { transaction });
    const offer = await db.Offers.findOne({
      where: { id: parsedOfferId, contestId: parsedContestId },
      transaction,
    });

    if (!contest || !offer || contest.status !== CONSTANTS.CONTEST_STATUS_ACTIVE) {
      await transaction.rollback();
      transaction = null;
      return next(new BadRequestError('Invalid offer status request'));
    }

    const { role, userId } = req.tokenData;
    let newStatus;
    let notificationMessage;

    if (role === CONSTANTS.MODERATOR) {
      if (
        !['approve', 'reject'].includes(command) ||
        offer.status !== CONSTANTS.OFFER_STATUS_PENDING
      ) {
        await transaction.rollback();
        transaction = null;
        return next(new RightsError('Offer cannot be moderated'));
      }
      newStatus = command === 'approve'
        ? CONSTANTS.OFFER_STATUS_APPROVED
        : CONSTANTS.OFFER_STATUS_REJECTED;
      notificationMessage = command === 'approve'
        ? 'Offer approved by moderator'
        : 'Offer rejected by moderator';
    } else if (role === CONSTANTS.CUSTOMER) {
      if (
        Number(contest.userId) !== Number(userId) ||
        !['resolve', 'reject'].includes(command) ||
        offer.status !== CONSTANTS.OFFER_STATUS_APPROVED
      ) {
        await transaction.rollback();
        transaction = null;
        return next(new RightsError('Offer cannot be changed'));
      }
      newStatus = command === 'resolve'
        ? CONSTANTS.OFFER_STATUS_WON
        : CONSTANTS.OFFER_STATUS_REJECTED;
      notificationMessage = command === 'resolve'
        ? 'Offer accepted by customer'
        : 'Offer rejected by customer';
    } else {
      await transaction.rollback();
      transaction = null;
      return next(new RightsError('Not allowed'));
    }

    await offer.update({ status: newStatus }, { transaction });

    if (command === 'resolve') {
      await db.Offers.update(
        { status: CONSTANTS.OFFER_STATUS_REJECTED },
        { where: { contestId: parsedContestId, id: { [db.Sequelize.Op.ne]: parsedOfferId } }, transaction },
      );
      await db.Contests.update(
        { status: CONSTANTS.CONTEST_STATUS_FINISHED },
        { where: { id: parsedContestId }, transaction },
      );
    }

    await transaction.commit();
    transaction = null;

    const updatedOffer = await db.Offers.findOne({
      where: { id: parsedOfferId },
      include: [{
        model: db.Users,
        attributes: ['id', 'firstName', 'lastName', 'displayName', 'email', 'avatar', 'rating'],
      }],
    });

    const socketInit = require('../socketInit');
    const notificationController = socketInit.getNotificationController();
    if (notificationController) {
      notificationController.emitChangeOfferStatus(
        offer.userId,
        notificationMessage,
        parsedContestId,
      );
      notificationController.emitChangeOfferStatus(
        contest.userId,
        notificationMessage,
        parsedContestId,
      );
    }

    res.send(updatedOffer);
  } catch (err) {
    if (transaction) await transaction.rollback();
    next(err);
  }
};

module.exports.getCustomersContests = async (req, res, next) => {
  try {
    const status = req.headers.status;
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const requestedOffset = Number.parseInt(req.query.offset, 10);
    if (![CONSTANTS.CONTEST_STATUS_ACTIVE, CONSTANTS.CONTEST_STATUS_FINISHED,
      CONSTANTS.CONTEST_STATUS_PENDING].includes(status)) {
      return next(new BadRequestError('Invalid contest status'));
    }

    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 10;
    const offset = Number.isInteger(requestedOffset) ? Math.max(requestedOffset, 0) : 0;
    const rows = await db.Contests.findAll({
      where: { status, userId: req.tokenData.userId },
      limit: limit + 1,
      offset,
      order: [['id', 'DESC']],
    });
    const haveMore = rows.length > limit;
    res.send({ contests: rows.slice(0, limit), haveMore });
  } catch (err) {
    next(err);
  }
};

module.exports.getContests = async (req, res, next) => {
  try {
    const requestedLimit = Number.parseInt(req.body.limit, 10);
    const requestedOffset = Number.parseInt(req.body.offset, 10);
    const typeIndex = req.body.typeIndex === undefined ? 1 : Number(req.body.typeIndex);
    const awardSort = req.body.awardSort || 'asc';
    const contestId = req.body.contestId ? Number(req.body.contestId) : '';
    if (
      !Number.isInteger(typeIndex) ||
      typeIndex < 1 ||
      typeIndex > 7 ||
      !['asc', 'desc'].includes(awardSort) ||
      (contestId !== '' && !Number.isInteger(contestId)) ||
      (req.body.onlyActive !== undefined && typeof req.body.onlyActive !== 'boolean')
    ) {
      return next(new BadRequestError('Invalid contest filters'));
    }
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 10;
    const offset = Number.isInteger(requestedOffset) ? Math.max(requestedOffset, 0) : 0;
    const predicates = UtilFunctions.createWhereForAllContests(
      typeIndex,
      contestId,
      req.body.industry,
      awardSort,
    );
    if (req.body.onlyActive === true) {
      predicates.where.status = CONSTANTS.CONTEST_STATUS_ACTIVE;
    }
    if (req.body.ownEntries === true) {
      const entries = await db.Offers.findAll({
        attributes: ['contestId'],
        where: { userId: req.tokenData.userId },
        group: ['contestId'],
        raw: true,
      });
      const contestIds = entries.map((entry) => entry.contestId);
      if (!contestIds.length) return res.send({ contests: [], haveMore: false });
      predicates.where.id = { [db.Sequelize.Op.in]: contestIds };
    }

    const rows = await db.Contests.findAll({
      where: predicates.where,
      order: predicates.order,
      limit: limit + 1,
      offset,
    });
    const haveMore = rows.length > limit;
    res.send({ contests: rows.slice(0, limit), haveMore });
  } catch (err) {
    next(err);
  }
}; 
const EDITABLE_CONTEST_FIELDS = [
  'title',
  'nameVenture',
  'typeOfName',
  'styleName',
  'targetCustomer',
  'industry',
  'focusOfWork',
  'brandStyle',
  'typeOfTagline',
  'domainQuestion',
];

module.exports.updateContest = async (req, res, next) => {
  try {
    const contestId = Number.parseInt(req.body.contestId, 10);
    if (!Number.isInteger(contestId)) {
      return next(new BadRequestError('contestId is required'));
    }

    const data = {};
    EDITABLE_CONTEST_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        data[field] = req.body[field];
      }
    });

    if (req.file) {
      data.fileName = req.file.filename;
      data.originalFileName = req.file.originalname;
    }

    if (!Object.keys(data).length) {
      return next(new BadRequestError('Nothing to update'));
    }

    const contest = await db.Contests.findOne({
      where: { id: contestId, userId: req.tokenData.userId },
    });

    if (!contest) {
      return next(new RightsError('Contest not found or you are not its owner'));
    }
    if (contest.status === CONSTANTS.CONTEST_STATUS_FINISHED) {
      return next(new BadRequestError('Finished contest cannot be edited'));
    }

    await contest.update(data);
    res.send(contest.get({ plain: true }));
  } catch (err) {
    next(err);
  }
};

module.exports.downloadFile = async (req, res) => {
  const fileName = path.basename(req.params.fileName);
  const filePath = path.resolve(CONSTANTS.CONTESTS_DEFAULT_DIR, fileName);
  res.download(filePath);
};
