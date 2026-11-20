const ApplicationError = require('./ApplicationError');

class NotUniqueEmail extends ApplicationError{
  constructor (message) {
    super(message || 'Unable to complete registration. Please review your details and try again.', 409);
  }
}

module.exports = NotUniqueEmail;
