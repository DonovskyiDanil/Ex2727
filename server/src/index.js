const http = require('http');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./dbMongo/mongoose');
const router = require('./router'); // Тот самый файл, который мы правили
const controller = require('./socketInit');
const handlerError = require('./handlerError/handler');
const { logError } = require('./errorLogging');

const PORT = 5001;
const app = express();

// 1. Настройка CORS (должна быть первой)
app.use(cors());

// 2. Парсинг тела запроса (обязательно ДО роутера)
app.use(express.json());

// 3. Статика
app.use('/public', express.static('public'));

// 4. ПОДКЛЮЧЕНИЕ РОУТЕРА
// Если твой фронтенд шлет запросы на http://localhost:5001/login, оставляем так:
app.use('/', router);

// 5. ЛОГГИРОВАНИЕ ОШИБОК (после роутера)
app.use((err, req, res, next) => {
  console.log('--- Ошибка поймана сервером ---');
  logError(err);
  next(err);
});

// 6. ФИНАЛЬНЫЙ ОБРАБОТЧИК (отправляет ответ клиенту)
app.use(handlerError);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  console.log(`Бэкенд готов принимать запросы на http://localhost:${PORT}`);
});

controller.createConnection(server);
