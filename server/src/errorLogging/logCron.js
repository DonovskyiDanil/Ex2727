const cron = require('node-cron');
const archiveLogs = require('./logArchiver');

cron.schedule('0 0 * * *', () => {
  try {
    archiveLogs();
  } catch (err) {
    console.error('[Cron] Could not archive error logs:', err.message);
  }
});
