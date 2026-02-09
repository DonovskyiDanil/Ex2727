const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const logDir = path.resolve(__dirname, '../../logs');
const logFile = path.resolve(logDir, 'errors.json');

console.log('!!! Файл крона загружен, ищет логи в:', logFile);
cron.schedule('0 0 * * *', () => {
  console.log('--- Крон проснулся по расписанию ---');

  if (fs.existsSync(logFile)) {
    try {
      const content = fs.readFileSync(logFile, 'utf8');
      const logs = content ? JSON.parse(content) : [];

      if (logs.length > 0) {
        const transformed = logs.map(({ message, code, time }) => ({
          message,
          code,
          time,
        }));

        const backupFile = path.resolve(logDir, `logs_${Date.now()}.json`);

        fs.writeFileSync(backupFile, JSON.stringify(transformed, null, 2));
        fs.writeFileSync(logFile, JSON.stringify([]));
        console.log(`[Cron] Успех! Создан бекап: ${path.basename(backupFile)}`);
      } else {
        console.log('[Cron] Файл пуст, ничего не копируем.');
      }
    } catch (err) {
      console.error('[Cron] Ошибка при чтении/записи:', err.message);
    }
  } else {
    console.log('[Cron] Файл errors.json еще не существует.');
  }
});
