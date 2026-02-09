const RightsError = require('../errors/RightsError');

module.exports = async (req, res, next) => {
  try {
    // req.tokenData з'являється після мідлвари checkToken
    if (req.tokenData.role !== 'moderator') {
      return next(new RightsError('Ця дія дозволена лише для модераторів!'));
    }
    next();
  } catch (err) {
    next(err);
  }
};
