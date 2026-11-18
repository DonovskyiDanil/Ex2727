const ApplicationError = require('./ApplicationError');

class NotUniqueEmail extends ApplicationError{
  constructor (message) {
<<<<<<< HEAD
    super(message || 'Unable to complete registration. Please review your details and try again.', 409);
=======
    super(message || 'this email were already exist', 409);
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  }
}

module.exports = NotUniqueEmail;
