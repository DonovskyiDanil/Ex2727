const RightsError = require('../errors/RightsError');
const CONSTANTS = require('../constants');

module.exports = (req, res, next) => {
  if (req.tokenData.role !== CONSTANTS.ADMIN) {
    return next(new RightsError('This action is only available to administrators'));
  }
  next();
};
