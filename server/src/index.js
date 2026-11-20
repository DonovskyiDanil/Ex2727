const http = require('http');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./router'); // Тот самый файл, который мы правили
const controller = require('./socketInit');
const handlerError = require('./handlerError/handler');
const { logError } = require('./errorLogging');

const PORT = 5001;
const app = express();

app.use(cors());

app.get('/health', (req, res) => res.status(200).send('ok'));


app.use(express.json());

app.use('/public', express.static('public'));


app.use('/', router);


app.use((err, req, res, next) => {
  try {
    logError(err);
  } catch (loggingError) {
    console.error('Failed to write error log:', loggingError.message);
  }
  next(err);
});


app.use(handlerError);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  console.log(`Бэкенд готов принимать запросы на http://localhost:${PORT}`);
});

controller.createConnection(server);
