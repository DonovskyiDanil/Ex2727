const express = require('express');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const chatController = require('../controllers/chatController');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const { uploadAvatar, uploadLogoFiles } = require('../utils/fileUpload');

const router = express.Router();

// --- АВТОРИЗАЦИЯ ---
router.post('/registration', hashPass, userController.registration);
router.post('/login', userController.login);
router.post('/getUser', checkToken.checkToken, userController.getUser);
router.post('/updateUser', checkToken.checkToken, uploadAvatar, userController.updateUser);

// --- ОПЛАТА И КОНКУРСЫ ---
router.post('/pay', checkToken.checkToken, basicMiddlewares.onlyForCustomer, userController.payment);
router.post('/dataForContest', checkToken.checkToken, contestController.dataForContest);
router.get('/customersContests', checkToken.checkToken, contestController.getCustomersContests);
router.get('/contestById', checkToken.checkToken, contestController.getContestById);

// --- СТАТИСТИКА И ПРОЧЕЕ ---
router.post('/changeMark', checkToken.checkToken, userController.changeMark);
router.post('/cashout', checkToken.checkToken, userController.cashout);
router.get('/getUserStats', checkToken.checkToken, userController.getUserStats);

// --- ОФФЕРЫ ---
router.post('/setNewOffer', checkToken.checkToken, uploadLogoFiles, contestController.setNewOffer);
router.post('/setOfferStatus', checkToken.checkToken, contestController.setOfferStatus);
router.post('/updateContest', checkToken.checkToken, contestController.updateContest);
router.get('/downloadFile/:fileName', checkToken.checkToken, contestController.downloadFile);

// --- ВСЕ КОНКУРСЫ ---
router.post('/getContests', checkToken.checkToken, contestController.getContests);

// --- ЧАТ ---
router.post('/getPreview', checkToken.checkToken, chatController.getPreview);
router.post('/getChat', checkToken.checkToken, chatController.getChat);
router.post('/addMessage', checkToken.checkToken, chatController.addMessage);

// --- РОУТЫ ДЛЯ МОДЕРАТОРА ---
// Обратите внимание: GET для списка, POST для действия
router.get('/all-offers', checkToken.checkToken, contestController.getOffersModeration);
router.post('/change-offer-status', checkToken.checkToken, contestController.changeOfferStatus);

// --- ЗАВДАННЯ 7, 8, 9: УПРАВЛІННЯ КОРИСТУВАЧАМИ ---
router.get('/users/count-by-role', checkToken.checkToken, userController.getUsersCountByRole);
router.post('/cashback/holiday', checkToken.checkToken, basicMiddlewares.onlyForCustomer, userController.applyHolidayCashback); // Только для Customer
router.post('/creative/top-bonus', checkToken.checkToken, basicMiddlewares.onlyForCreative, userController.payTopCreatives); // Только для Creative

module.exports = router;
