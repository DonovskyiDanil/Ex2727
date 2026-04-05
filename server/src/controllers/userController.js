const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const db = require('../models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const moment = require('moment');
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
    const newUser = await userQueries.userCreation({ ...req.body, password: req.hashPass });
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

// --- ОПЛАТА (ИСПРАВЛЕННАЯ) ---

module.exports.payment = async (req, res, next) => {
  let transaction;
  try {
    const { contests, price, expiry } = req.body;
    
    // Гибкий прием полей (убираем пробелы из номера карты)
    const number = (req.body.number || req.body.cardNumber || '').replace(/ /g, '');
    const cvc = req.body.cvc || req.body.cvv || req.body.securityCode;

    if (!number || !cvc || !expiry || price === undefined) {
      return res.status(400).send('Missing payment information (card number, cvc, expiry or price)');
    }

    transaction = await db.sequelize.transaction();

    // 1. Списываем деньги у пользователя
    await bankQueries.updateBankBalance({ number, cvc, expiry, price: -price }, transaction);
    
    // 2. Зачисляем деньги Squadhelp
    await bankQueries.updateBankBalance({
      number: CONSTANTS.SQUADHELP_BANK_NUMBER,
      cvc: CONSTANTS.SQUADHELP_BANK_CVC,
      expiry: CONSTANTS.SQUADHELP_BANK_EXPIRY,
      price: price,
    }, transaction);

    const orderId = uuid();
    const contestsToCreate = contests.map((c, i) => ({
      ...c,
      status: i === 0 ? 'active' : 'pending',
      userId: req.tokenData.userId,
      priority: i + 1,
      orderId,
      createdAt: moment().format('YYYY-MM-DD HH:mm'),
      prize: Math.floor(price / contests.length),
    }));

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

// Заглушки, необходимые для router/index.js
module.exports.cashout = async (req, res, next) => { 
  res.send({ message: 'Cashout successful' }); 
};

module.exports.getUserStats = async (req, res, next) => { 
  res.send({ stats: { totalEntries: 0, winningEntries: 0 } }); 
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, displayName, email } = req.body;
    const userId = req.tokenData.userId;
    
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (displayName !== undefined) updateData.displayName = displayName;
    if (email !== undefined) updateData.email = email;
    
    // Handle avatar file upload
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
