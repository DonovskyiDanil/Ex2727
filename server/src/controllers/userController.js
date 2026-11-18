const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');
const db = require('../models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const InvalidCredentialsError = require('../errors/InvalidCredentialsError');
const BadRequestError = require('../errors/BadRequestError');
const RightsError = require('../errors/RightsError');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');
const NotFoundError = require('../errors/UserNotFoundError');

const isUploadedContestImage = (fileName) => {
  if (
    typeof fileName !== 'string' ||
    path.basename(fileName) !== fileName ||
    !/^[a-f0-9-]{36}\.(jpe?g|png|gif|webp)$/i.test(fileName)
  ) {
    return false;
  }
  return fs.existsSync(path.resolve(__dirname, '../../public/images', fileName));
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new InvalidCredentialsError());
    }

    const user = await db.Users.findOne({ where: { email } });
    // Одинаковый ответ и когда пользователя нет, и когда пароль неверный:
    // иначе форма логина превращается в инструмент перебора существующих email.
    if (!user) {
      return next(new InvalidCredentialsError());
    }

    const foundUser = user.get({ plain: true });
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return next(new InvalidCredentialsError());
    }

    const token = jwt.sign({
      userId: foundUser.id,
      role: foundUser.role,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
    }, CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });

    await userQueries.updateUser({ accessToken: token }, foundUser.id);
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.registration = async (req, res, next) => {
  try {
    if (![CONSTANTS.CUSTOMER, CONSTANTS.CREATOR].includes(req.body.role)) {
      return next(new BadRequestError('Invalid registration details'));
    }

    const userData = Object.assign({}, req.body);
    userData.password = req.hashPass;
    const newUser = await userQueries.userCreation(userData);
    const token = jwt.sign({ userId: newUser.id, role: newUser.role },
      CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });
    await userQueries.updateUser({ accessToken: token }, newUser.id);
    res.send({ token });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') next(new NotUniqueEmail());
    else next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await userQueries.findUser({ id: req.tokenData.userId });
    if (!user) return next(new NotFoundError('User not found'));
    delete user.password;
    delete user.accessToken;
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// --- ОПЛАТА ---

module.exports.payment = async (req, res, next) => {
  let transaction;
  try {
    const { contests, expiry: rawExpiry } = req.body;
    const price = contests.length * 100;
    const number = (req.body.number || req.body.cardNumber || '').replace(/ /g, '');
    const cvc = String(req.body.cvc || req.body.cvv || req.body.securityCode || '');
    const expiry = String(rawExpiry || '');

    if (
      !number ||
      number === CONSTANTS.SQUADHELP_BANK_NUMBER ||
      !cvc ||
      !expiry ||
      !Array.isArray(contests) ||
      contests.length < 1 ||
      contests.length > 3 ||
      contests.some((contest) => (
        !contest ||
        ![CONSTANTS.NAME_CONTEST, CONSTANTS.TAGLINE_CONTEST, CONSTANTS.LOGO_CONTEST]
          .includes(contest.contestType) ||
        (contest.contestType === CONSTANTS.LOGO_CONTEST &&
          !isUploadedContestImage(contest.fileName))
      ))
    ) {
      return next(new BadRequestError('Invalid payment information'));
    }

    transaction = await db.sequelize.transaction();

    await bankQueries.updateBankBalance({
      number,
      cvc,
      expiry,
      price: -price,
    }, transaction);

    await bankQueries.updateBankBalance({
      number: CONSTANTS.SQUADHELP_BANK_NUMBER || '1234567890123456',
      cvc: CONSTANTS.SQUADHELP_BANK_CVC || '123',
      expiry: CONSTANTS.SQUADHELP_BANK_EXPIRY || '11/29',
      price,
    }, transaction);

    const orderId = uuid();
    const totalCents = Math.round(price * 100);
    const baseCents = Math.floor(totalCents / contests.length);
    const remainderCents = totalCents % contests.length;
    const contestsToCreate = contests.map((c, i) => {
      const contest = Object.assign({}, c);
      contest.status = i === 0 ? 'active' : 'pending';
      contest.userId = req.tokenData.userId;
      contest.priority = i + 1;
      contest.orderId = orderId;
      contest.createdAt = new Date();
      contest.prize = ((baseCents + (i < remainderCents ? 1 : 0)) / 100).toFixed(2);
      return contest;
    });

    await db.Contests.bulkCreate(contestsToCreate, { transaction });
    await transaction.commit();
    res.send({ message: 'Payment success', orderId });
  } catch (err) {
    if (transaction && !transaction.finished) await transaction.rollback();
    next(err);
  }
};

// --- ОЦЕНКИ И СТАТИСТИКА ---

module.exports.changeMark = async (req, res, next) => {
  let transaction;
  try {
    if (req.tokenData.role !== CONSTANTS.CUSTOMER) {
      return next(new RightsError('Only customers can rate offers'));
    }
    const offerId = Number(req.body.offerId);
    const mark = Number(req.body.mark);
    if (!Number.isInteger(offerId) || !Number.isInteger(mark) || mark < 0 || mark > 5) {
      return next(new BadRequestError('Invalid rating'));
    }

    transaction = await db.sequelize.transaction();
    const offer = await db.Offers.findOne({
      where: { id: offerId },
      include: [{
        model: db.Contests,
        required: true,
        where: { userId: req.tokenData.userId },
      }],
      transaction,
    });
    if (!offer) {
      await transaction.rollback();
      transaction = null;
      return next(new RightsError('Offer cannot be rated'));
    }

    const existingRating = await db.Ratings.findOne({
      where: { offerId, userId: req.tokenData.userId },
      transaction,
    });
    if (existingRating) {
      await ratingQueries.updateRating(
        { mark },
        { offerId, userId: req.tokenData.userId },
        transaction,
      );
    } else {
      await ratingQueries.createRating(
        { offerId, mark, userId: req.tokenData.userId },
        transaction,
      );
    }

    const ratings = await db.Ratings.findAll({
      include: [{ model: db.Offers, required: true, where: { userId: offer.userId } }],
      transaction,
    });

    const avg = ratings.reduce((acc, r) => acc + r.mark, 0) / ratings.length;
    await userQueries.updateUser({ rating: avg }, offer.userId, transaction);

    await transaction.commit();
    transaction = null;
    const notificationController = controller.getNotificationController();
    if (notificationController) notificationController.emitChangeMark(offer.userId);
    res.send({ rating: avg, userId: offer.userId });
  } catch (err) {
    if (transaction && !transaction.finished) await transaction.rollback();
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  let transaction;
  try {
    const { number, expiry, cvc, sum: rawSum } = req.body;
    const sum = Number(rawSum);
    if (
      !number ||
      !expiry ||
      !cvc ||
      !Number.isFinite(sum) ||
      sum < 5 ||
      Math.abs(sum * 100 - Math.round(sum * 100)) > 1e-8
    ) {
      return next(new BadRequestError('Invalid cashout information'));
    }

    transaction = await db.sequelize.transaction();
    const user = await db.Users.findByPk(req.tokenData.userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!user || user.role !== CONSTANTS.CREATOR) {
      await transaction.rollback();
      transaction = null;
      return next(new RightsError('Cashout is only available to creators'));
    }
    if (sum > Number(user.balance)) {
      await transaction.rollback();
      transaction = null;
      return next(new BadRequestError('Insufficient account balance'));
    }

    await bankQueries.updateBankBalance({
      number: number.replace(/\s/g, ''),
      cvc: String(cvc),
      expiry: String(expiry),
      price: sum,
    }, transaction);
    await user.update(
      { balance: (Number(user.balance) - sum).toFixed(2) },
      { transaction },
    );
    await transaction.commit();
    transaction = null;

    const updatedUser = user.get({ plain: true });
    delete updatedUser.password;
    delete updatedUser.accessToken;
    res.send(updatedUser);
  } catch (err) {
    if (transaction && !transaction.finished) await transaction.rollback();
    next(err);
  }
};

module.exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.tokenData.userId;
    const [totalEntries, winningEntries, pendingReview] = await Promise.all([
      db.Offers.count({ where: { userId } }),
      db.Offers.count({
        where: { userId, status: CONSTANTS.OFFER_STATUS_WON },
      }),
      db.Offers.count({
        where: { userId, status: CONSTANTS.OFFER_STATUS_PENDING },
      }),
    ]);
    res.send({
      stats: {
        totalEntries,
        winningEntries,
        pendingReview,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, displayName, email } = req.body;
    const { userId } = req.tokenData;

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (displayName !== undefined) updateData.displayName = displayName;
    if (email !== undefined) updateData.email = email;

    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    await db.Users.update(updateData, { where: { id: userId } });

    const updatedUser = await userQueries.findUser({ id: userId });
    delete updatedUser.password;
    delete updatedUser.accessToken;
    res.send(updatedUser);
  } catch (err) {
    next(err);
  }
};

// --- ЗАВДАННЯ 7 ---

module.exports.getUsersCountByRole = async (req, res, next) => {
  try {
    const result = await db.Users.findAll({
      attributes: [
        'role',
        [db.sequelize.fn('COUNT', db.sequelize.col('role')), 'count'],
      ],
      group: ['role'],
      raw: true,
    });

    const roleCounts = {};
    result.forEach(row => {
      roleCounts[row.role] = Number.parseInt(row.count, 10);
    });

    res.send(roleCounts);
  } catch (err) {
    next(err);
  }
};

// --- ЗАВДАННЯ 8 ---

module.exports.applyHolidayCashback = async (req, res, next) => {
  let transaction;
  try {
    const startDate = '2024-12-25 00:00:00';
    const endDate = '2025-01-15 00:00:00';
    const reference = '2024-12-25:2025-01-14';
    transaction = await db.sequelize.transaction();

    const [customers] = await db.sequelize.query(
      `SELECT c."userId" AS "userId",
              ROUND(SUM(c.prize) * 0.10, 2) AS cashback
         FROM "Contests" c
         JOIN "Users" u ON u.id = c."userId"
        WHERE u.role = :role
          AND c."createdAt" >= :startDate
          AND c."createdAt" < :endDate
        GROUP BY c."userId"
       HAVING SUM(c.prize) > 0`,
      {
        replacements: {
          role: CONSTANTS.CUSTOMER,
          startDate,
          endDate,
        },
        transaction,
      },
    );
    const results = [];
    for (const customer of customers) {
      const [inserted] = await db.sequelize.query(
        `INSERT INTO "UserRewards" ("userId", type, reference, amount, "createdAt")
         VALUES (:userId, 'holiday_cashback', :reference, :amount, CURRENT_TIMESTAMP)
         ON CONFLICT ("userId", type, reference) DO NOTHING
         RETURNING id`,
        {
          replacements: {
            userId: customer.userId,
            reference,
            amount: customer.cashback,
          },
          transaction,
        },
      );
      if (!inserted.length) continue;

      await db.Users.update(
        { balance: db.sequelize.literal(`balance + ${Number(customer.cashback).toFixed(2)}`) },
        { where: { id: customer.userId }, transaction },
      );
      results.push({ userId: customer.userId, cashback: customer.cashback });
    }

    await transaction.commit();
    res.send({ message: 'Cashback applied successfully', results });
  } catch (err) {
    if (transaction && !transaction.finished) await transaction.rollback();
    next(err);
  }
};

// --- ЗАВДАННЯ 9 ---

module.exports.payTopCreatives = async (req, res, next) => {
  let transaction;
  try {
    const bonusAmount = 10;
    const topCount = 3;
    const reference = 'exam-top-creative-bonus';
    transaction = await db.sequelize.transaction();

    const topCreatives = await db.Users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'email', 'rating', 'balance'],
      where: { role: 'creator' },
      order: [['rating', 'DESC'], ['id', 'ASC']],
      limit: topCount,
      transaction,
    });

    const results = [];
    for (const creative of topCreatives) {
      const [inserted] = await db.sequelize.query(
        `INSERT INTO "UserRewards" ("userId", type, reference, amount, "createdAt")
         VALUES (:userId, 'top_creative_bonus', :reference, :amount, CURRENT_TIMESTAMP)
         ON CONFLICT ("userId", type, reference) DO NOTHING
         RETURNING id`,
        {
          replacements: {
            userId: creative.id,
            reference,
            amount: bonusAmount,
          },
          transaction,
        },
      );
      if (!inserted.length) continue;

      await db.Users.update(
        { balance: db.sequelize.literal(`balance + ${bonusAmount.toFixed(2)}`) },
        { where: { id: creative.id }, transaction },
      );

      results.push({
        userId: creative.id,
        displayName: creative.displayName,
        email: creative.email,
        rating: creative.rating,
        previousBalance: creative.balance,
        newBalance: Number(creative.balance) + bonusAmount,
        bonus: bonusAmount,
      });
    }

    await transaction.commit();
    res.send({ message: `Top ${topCount} creatives received bonus`, results });
  } catch (err) {
    if (transaction && !transaction.finished) await transaction.rollback();
    next(err);
  }
};
