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
    code: err.code || 500,
    stackTrace: err.stack || {},
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
