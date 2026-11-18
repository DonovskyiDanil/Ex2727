const fs = require('fs');
const path = require('path');

const defaultLogFile = path.resolve(__dirname, '../../logs/errors.json');

const archiveLogs = (logFile = defaultLogFile, timestamp = Date.now()) => {
  if (!fs.existsSync(logFile)) return null;

  const content = fs.readFileSync(logFile, 'utf8');
  const logs = content ? JSON.parse(content) : [];
  if (!Array.isArray(logs)) {
    throw new TypeError('Error log must contain a JSON array');
  }
  if (logs.length === 0) return null;

  const transformed = logs.map(({ message, code, time }) => ({
    message,
    code,
    time,
  }));
  const archiveFile = path.join(path.dirname(logFile), `logs_${timestamp}.json`);

  fs.writeFileSync(archiveFile, JSON.stringify(transformed, null, 2));
  fs.writeFileSync(logFile, JSON.stringify([]));
  return archiveFile;
};

module.exports = archiveLogs;
