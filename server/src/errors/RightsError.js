const ApplicationError = require('./ApplicationError');

class RightsError extends ApplicationError{
  constructor (message) {
<<<<<<< HEAD
    super(message || 'not enough rights', 403);
=======
    super(message || 'not enough rights', 423);
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  }
}

module.exports = RightsError;
