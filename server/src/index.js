// Polyfill for SlowBuffer (Node.js v25 compatibility)
if (typeof Buffer.SlowBuffer === 'undefined') {
  Buffer.SlowBuffer = function SlowBuffer(size) {
    return Buffer.allocUnsafe(size);
  };
}

const { logError } = require('./errorLogging');
const http = require('http');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./dbMongo/mongoose');
const router = require('./router');
const controller = require('./socketInit');
const handlerError = require('./handlerError/handler');

const PORT = 5001;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));


app.get('/test-error', (req, res, next) => {
  console.log('--- Тестовый роут вызван! ---');
  const error = new Error('Тестовая ошибка');
  error.code = 404;
  next(error);
});

app.use(router);

app.use((err, req, res, next) => {
  console.log('--- Логгер перехватил ошибку! ---');
  logError(err);
  next(err);
});

app.use(handlerError);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
controller.createConnection(server);
