const ApplicationError = require('./ApplicationError');

/**
 * Единая ошибка для логина: намеренно не раскрываем,
 * что именно неверно — email или пароль.
 */
class InvalidCredentialsError extends ApplicationError {
  constructor (message) {
    super(message || 'Invalid email or password', 401);
  }
}

module.exports = InvalidCredentialsError;
