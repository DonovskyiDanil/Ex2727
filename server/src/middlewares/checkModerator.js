const RightsError = require('../errors/RightsError');
<<<<<<< HEAD
const CONSTANTS = require('../constants');
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

module.exports = async (req, res, next) => {
  try {
    // req.tokenData з'являється після мідлвари checkToken
<<<<<<< HEAD
    if (req.tokenData.role !== CONSTANTS.MODERATOR) {
=======
    if (req.tokenData.role !== 'moderator') {
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      return next(new RightsError('Ця дія дозволена лише для модераторів!'));
    }
    next();
  } catch (err) {
    next(err);
  }
};
