const RightsError = require('../errors/RightsError');
const CONSTANTS = require('../constants');

module.exports = async (req, res, next) => {
  try {
    if (req.tokenData.role !== CONSTANTS.MODERATOR) {
      return next(new RightsError('Ця дія дозволена лише для модераторів!'));
    }
    next();
  } catch (err) {
    next(err);
  }
};
