const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');

module.exports.checkAuth = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return next(new TokenError('need token'));
  }

  try {
    const tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });

    if (!foundUser) {
      return next(new TokenError('User not found'));
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
    // ВЫВОД В ТЕРМИНАЛ VS CODE ДЛЯ ОТЛАДКИ
    console.error('------- AUTH ERROR (checkAuth) -------');
    console.error('Reason:', err.message);
    console.error('--------------------------------------');

    next(new TokenError(err.message));
  }
};

module.exports.checkToken = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return next(new TokenError('need token'));
  }

  try {
    req.tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    next();
  } catch (err) {
    // ВЫВОД В ТЕРМИНАЛ VS CODE ДЛЯ ОТЛАДКИ
    console.error('------- AUTH ERROR (checkToken) -------');
    console.error('Reason:', err.message);
    console.error('---------------------------------------');

    next(new TokenError(err.message));
  }
};
