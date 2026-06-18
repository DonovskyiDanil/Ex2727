const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const db = require('../models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const { v4: uuid } = require('uuid');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

module.exports.login = async (req, res, next) => {
  try {
    const foundUser = await userQueries.findUser({ email: req.body.email });
    if (!foundUser) return res.status(404).send('User not found');

    await userQueries.passwordCompare(req.body.password, foundUser.password);

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
    if (!user) return res.status(404).send('User not found');
    user.password = undefined; // Скрываем пароль
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// --- ОПЛАТА ---

module.exports.payment = async (req, res, next) => {
  let transaction;
  try {
    const { contests, price: rawPrice, expiry: rawExpiry } = req.body;
    const price = parseFloat(rawPrice);
    const number = (req.body.number || req.body.cardNumber || '').replace(/ /g, '');
    const cvc = String(req.body.cvc || req.body.cvv || req.body.securityCode || '');
    const expiry = String(rawExpiry || '');

    if (!number || !cvc || !expiry || isNaN(price) || price <= 0) {
      return res.status(400).send('Missing payment information');
    }

    transaction = await db.sequelize.transaction();

    // Переконайтеся, що ці константи визначені на сервері в constants.js
    await bankQueries.updateBankBalance({
      number,
      cardNumber: number,
      cvc,
      expiry,
      price: -price,
    }, transaction);

    await bankQueries.updateBankBalance({
      number: CONSTANTS.SQUADHELP_BANK_NUMBER || '1234567890123456',
      cardNumber: CONSTANTS.SQUADHELP_BANK_NUMBER || '1234567890123456',
      cvc: CONSTANTS.SQUADHELP_BANK_CVC || '123',
      expiry: CONSTANTS.SQUADHELP_BANK_EXPIRY || '12/30',
      price, // Сокращено (object-shorthand)
    }, transaction);

    const orderId = uuid();
    const contestsToCreate = contests.map((c, i) => {
      const contest = Object.assign({}, c);
      contest.status = i === 0 ? 'active' : 'pending';
      contest.userId = req.tokenData.userId;
      contest.priority = i + 1;
      contest.orderId = orderId;
      contest.createdAt = new Date(); // Використання об'єкта Date надійніше для Sequelize
      contest.prize = Math.floor(price / contests.length);
      return contest;
    });

    await db.Contests.bulkCreate(contestsToCreate, { transaction });
    await transaction.commit();
    res.send({ message: 'Payment success', orderId });
  } catch (err) {
    if (transaction) await transaction.rollback();
    next(err);
  }
};

// --- ОЦЕНКИ И СТАТИСТИКА ---

module.exports.changeMark = async (req, res, next) => {
  let transaction;
  try {
    const { offerId, mark, creatorId, isFirst } = req.body;
    transaction = await db.sequelize.transaction();

    if (isFirst) {
      await ratingQueries.createRating({ offerId, mark, userId: req.tokenData.userId }, transaction);
    } else {
      await ratingQueries.updateRating({ mark }, { offerId, userId: req.tokenData.userId }, transaction);
    }

    const ratings = await db.Ratings.findAll({
      include: [{ model: db.Offers, required: true, where: { userId: creatorId } }],
      transaction,
    });

    const avg = ratings.reduce((acc, r) => acc + r.mark, 0) / ratings.length;
    await userQueries.updateUser({ rating: avg }, creatorId, transaction);

    await transaction.commit();
    controller.getNotificationController().emitChangeMark(creatorId);
    res.send({ rating: avg });
  } catch (err) {
    if (transaction) await transaction.rollback();
    next(err);
  }
};

module.exports.cashout = async (req, res) => {
  res.send({ message: 'Cashout successful' });
};

module.exports.getUserStats = async (req, res) => {
  res.send({ stats: { totalEntries: 0, winningEntries: 0 } });
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
    updatedUser.password = undefined;
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
      roleCounts[row.role] = parseInt(row.count, 10);
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
    const { startDate = '2024-12-25 00:00:00', endDate = '2025-01-14 23:59:59', percentage = 0.1 } = req.body;
    transaction = await db.sequelize.transaction();

    const customers = await db.Users.findAll({
      attributes: ['id', 'email'],
      where: { role: 'customer' },
      include: [{
        model: db.Contests,
        where: {
          createdAt: {
            [db.Sequelize.Op.gte]: startDate,
            [db.Sequelize.Op.lte]: endDate,
          },
        },
        attributes: ['prize'],
      }],
      transaction,
    });

    const results = [];
    for (const customer of customers) {
      const totalSpent = customer.Contests.reduce((sum, contest) => sum + (contest.prize || 0), 0);
      const cashback = Math.round(totalSpent * percentage * 100) / 100;

      if (cashback > 0) {
        await db.Users.update(
          { balance: db.sequelize.literal(`balance + ${cashback}`) },
          { where: { id: customer.id }, transaction },
        );

        results.push({
          userId: customer.id,
          email: customer.email,
          totalSpent,
          cashback,
        });
      }
    }

    await transaction.commit();
    res.send({ message: 'Cashback applied successfully', results });
  } catch (err) {
    if (transaction) await transaction.rollback();
    next(err);
  }
};

// --- ЗАВДАННЯ 9 ---

module.exports.payTopCreatives = async (req, res, next) => {
  let transaction;
  try {
    const { bonusAmount = 10, topCount = 3 } = req.body;
    transaction = await db.sequelize.transaction();

    const topCreatives = await db.Users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'email', 'rating', 'balance'],
      where: { role: 'creator' },
      order: [['rating', 'DESC']],
      limit: topCount,
      transaction,
    });

    const results = [];
    for (const creative of topCreatives) {
      await db.Users.update(
        { balance: db.sequelize.literal(`balance + ${bonusAmount}`) },
        { where: { id: creative.id }, transaction },
      );

      results.push({
        userId: creative.id,
        displayName: creative.displayName,
        email: creative.email,
        rating: creative.rating,
        previousBalance: creative.balance,
        newBalance: creative.balance + bonusAmount,
        bonus: bonusAmount,
      });
    }

    await transaction.commit();
    res.send({ message: `Top ${topCount} creatives received bonus`, results });
  } catch (err) {
    if (transaction) await transaction.rollback();
    next(err);
  }
};
