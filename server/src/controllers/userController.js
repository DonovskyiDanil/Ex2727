const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const db = require('../models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const TokenError = require('../errors/TokenError');
const moment = require('moment');
const { v4: uuid } = require('uuid');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');

module.exports.login = async (req, res, next) => {
  try {
    console.log('--- Login Attempt ---', req.body.email);
    const foundUser = await userQueries.findUser({ email: req.body.email });
    await userQueries.passwordCompare(req.body.password, foundUser.password);

    const accessToken = jwt.sign({
      firstName: foundUser.firstName,
      userId: foundUser.id,
      role: foundUser.role,
      lastName: foundUser.lastName,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
      rating: foundUser.rating,
    }, CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });

    await userQueries.updateUser({ accessToken }, foundUser.id);
    console.log(`User ${foundUser.id} logged in successfully`);
    res.send({ token: accessToken });
  } catch (err) {
    console.error('Login Error:', err.message);
    next(err);
  }
};

module.exports.registration = async (req, res, next) => {
  try {
    console.log('--- Registration Attempt ---', req.body.email);
    const newUser = await userQueries.userCreation(
      Object.assign(req.body, { password: req.hashPass }));

    const accessToken = jwt.sign({
      firstName: newUser.firstName,
      userId: newUser.id,
      role: newUser.role,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      displayName: newUser.displayName,
      balance: newUser.balance,
      email: newUser.email,
      rating: newUser.rating,
    }, CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });

    await userQueries.updateUser({ accessToken }, newUser.id);
    console.log(`User ${newUser.id} registered successfully`);
    res.send({ token: accessToken });
  } catch (err) {
    console.error('Registration Error:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
  }
};

module.exports.changeMark = async (req, res, next) => {
  let sum = 0;
  let avg = 0;
  let transaction;
  const { isFirst, offerId, mark, creatorId } = req.body;
  const userId = req.tokenData && req.tokenData.userId;

  try {
    console.log(`--- Change Mark --- User: ${userId}, Target: ${creatorId}, Mark: ${mark}`);
    transaction = await db.sequelize.transaction(
      { isolationLevel: db.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED });

    const query = getQuery(offerId, userId, mark, isFirst, transaction);
    await query();

    const offersArray = await db.Ratings.findAll({
      include: [{
        model: db.Offers,
        required: true,
        where: { userId: creatorId },
      }],
      transaction,
    });

    for (let i = 0; i < offersArray.length; i++) {
      sum += offersArray[i].dataValues.mark;
    }
    avg = sum / offersArray.length;

    await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    await transaction.commit();

    controller.getNotificationController().emitChangeMark(creatorId);
    console.log(`Rating updated for user ${creatorId}: ${avg}`);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Change Mark Error:', err);
    next(err);
  }
};

module.exports.payment = async (req, res, next) => {
  let transaction;
  try {
    console.log('--- Payment Process Started --- User:', req.tokenData && req.tokenData.userId);
    transaction = await db.sequelize.transaction();

    await bankQueries.updateBankBalance({
      balance: db.sequelize.literal(`
                CASE
            WHEN "cardNumber"='${ req.body.number.replace(/ /g, '') }' AND "cvc"='${ req.body.cvc }' AND "expiry"='${ req.body.expiry }'
                THEN "balance"-${ req.body.price }
            WHEN "cardNumber"='${ CONSTANTS.SQUADHELP_BANK_NUMBER }' AND "cvc"='${ CONSTANTS.SQUADHELP_BANK_CVC }' AND "expiry"='${ CONSTANTS.SQUADHELP_BANK_EXPIRY }'
                THEN "balance"+${ req.body.price } END
        `),
    },
    {
      cardNumber: {
        [ db.Sequelize.Op.in ]: [
          CONSTANTS.SQUADHELP_BANK_NUMBER,
          req.body.number.replace(/ /g, ''),
        ],
      },
    },
    transaction);

    const orderId = uuid();
    req.body.contests.forEach((contest, index) => {
      const prize = index === req.body.contests.length - 1
        ? Math.ceil(req.body.price / req.body.contests.length)
        : Math.floor(req.body.price / req.body.contests.length);

      Object.assign(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId: req.tokenData.userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize,
      });
    });

    await db.Contests.bulkCreate(req.body.contests, transaction);
    await transaction.commit();
    console.log('Payment successful for order:', orderId);
    res.send();
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Payment Error:', err);
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    console.log('--- Updating Profile --- User:', req.tokenData && req.tokenData.userId);
    if (req.file) {
      req.body.avatar = req.file.filename;
    }
    const updatedUser = await userQueries.updateUser(req.body, req.tokenData.userId);
    res.send({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      displayName: updatedUser.displayName,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      balance: updatedUser.balance,
      role: updatedUser.role,
      id: updatedUser.id,
    });
  } catch (err) {
    console.error('Update User Error:', err);
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  let transaction;
  try {
    console.log('--- Cashout Request --- User:', req.tokenData && req.tokenData.userId);
    transaction = await db.sequelize.transaction();

    const updatedUser = await userQueries.updateUser(
      { balance: db.sequelize.literal('balance - ' + req.body.sum) },
      req.tokenData.userId, transaction);

    await bankQueries.updateBankBalance({
      balance: db.sequelize.literal(`CASE 
                WHEN "cardNumber"='${ req.body.number.replace(/ /g, '') }' AND "expiry"='${ req.body.expiry }' AND "cvc"='${ req.body.cvc }'
                    THEN "balance"+${ req.body.sum }
                WHEN "cardNumber"='${ CONSTANTS.SQUADHELP_BANK_NUMBER }' AND "expiry"='${ CONSTANTS.SQUADHELP_BANK_EXPIRY }' AND "cvc"='${ CONSTANTS.SQUADHELP_BANK_CVC }'
                    THEN "balance"-${ req.body.sum }
                 END
                `),
    },
    {
      cardNumber: {
        [ db.Sequelize.Op.in ]: [
          CONSTANTS.SQUADHELP_BANK_NUMBER,
          req.body.number.replace(/ /g, ''),
        ],
      },
    },
    transaction);

    await transaction.commit();
    console.log(`Cashout successful for user ${req.tokenData.userId}: ${req.body.sum}`);
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Cashout Error:', err);
    next(err);
  }
};

// --- ВОТ ТВОЯ ОШИБКА 500 МОЖЕТ БЫТЬ ТУТ ---
module.exports.getUser = async (req, res, next) => {
  try {
    console.log('--- Get User Request ---');

    // ЛОГ ПРОВЕРКИ ТОКЕНА
    if (!req.tokenData) {
      console.error('ERROR: req.tokenData is undefined! Проверь мидлвар проверки токена в роутах.');
      return res.status(401).send('No token data');
    }

    console.log('Fetching user ID:', req.tokenData.userId);
    const foundUser = await userQueries.findUser({ id: req.tokenData.userId });

    if (!foundUser) {
      console.error(`ERROR: User with ID ${req.tokenData.userId} not found in DB`);
      return res.status(404).send('User not found');
    }

    res.send({
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      id: foundUser.id,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
    });
  } catch (err) {
    console.error('FATAL ERROR in getUser:', err.stack); // stack даст строку, где упало
    next(err);
  }
};

module.exports.getUserStats = async (req, res, next) => {
  try {
    console.log('--- Fetching User Stats ---');
    const stats = await db.Users.findAll({
      attributes: [
        'role',
        [db.Sequelize.fn('count', db.Sequelize.col('id')), 'count'],
      ],
      group: ['role'],
    });

    const result = stats.reduce((acc, current) => {
      acc[current.role] = parseInt(current.get('count'));
      return acc;
    }, {});

    res.send(result);
  } catch (err) {
    console.error('Stats Error:', err);
    next(err);
  }
};

module.exports.applyNewYearCashback = async (req, res, next) => {
  let transaction;
  try {
    console.log('--- Applying NY Cashback ---');
    transaction = await db.sequelize.transaction();
    const [, metadata] = await db.sequelize.query(`
      UPDATE "Users"
      SET balance = balance + subquery.cashback
      FROM (
          SELECT u.id, SUM(c.prize) * 0.1 as cashback
          FROM "Users" u
          JOIN "Contests" c ON u.id = c."userId"
          WHERE u.role = 'customer'
            AND c."createdAt" >= '2024-12-25 00:00:00'
            AND c."createdAt" <= '2025-01-14 23:59:59'
          GROUP BY u.id
      ) AS subquery
      WHERE "Users".id = subquery.id;
    `, { transaction });

    await transaction.commit();
    console.log(`Cashback success. Rows updated: ${metadata.rowCount}`);
    res.send({
      message: 'Кешбек нараховано',
      updatedCount: metadata.rowCount,
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Cashback Error:', err);
    next(err);
  }
};

// Вспомогательная функция (оставлена без изменений)
function getQuery (offerId, userId, mark, isFirst, transaction) {
  const getCreateQuery = () => ratingQueries.createRating({ offerId, mark, userId }, transaction);
  const getUpdateQuery = () => ratingQueries.updateRating({ mark }, { offerId, userId }, transaction);
  return isFirst ? getCreateQuery : getUpdateQuery;
}
