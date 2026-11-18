const fs = require('fs');
const path = require('path');
const logDir = path.resolve(__dirname, '../../logs');
const logFile = path.resolve(logDir, 'errors.json');

module.exports = (err) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const errorObj = {
    message: err.message || 'No message',
    time: Date.now(),
<<<<<<< HEAD
    code: Number.isInteger(err.statusCode)
      ? err.statusCode
      : Number.isInteger(err.code)
        ? err.code
        : 500,
    stackTrace: {
      name: err.name || 'Error',
      frames: typeof err.stack === 'string'
        ? err.stack.split('\n').slice(1).map((frame) => frame.trim())
        : [],
    },
=======
    code: err.code || 500,
    stackTrace: err.stack || {},
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  };

  let logs = [];
  if (fs.existsSync(logFile)) {
    const content = fs.readFileSync(logFile, 'utf8');
    logs = content ? JSON.parse(content) : [];
  }

  logs.push(errorObj);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  console.log('--- Ошибка записана в файл! ---');
};
