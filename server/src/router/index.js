const express = require('express');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const chatController = require('../controllers/chatController');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const { uploadAvatar } = require('../utils/fileUpload');

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
router.get('/getCustomersContests', checkToken.checkToken, contestController.getCustomersContests);
router.get('/contestById', checkToken.checkToken, contestController.getContestById);

// --- СТАТИСТИКА И ПРОЧЕЕ ---
router.post('/changeMark', checkToken.checkToken, userController.changeMark);
router.post('/cashout', checkToken.checkToken, userController.cashout);
router.get('/getUserStats', checkToken.checkToken, userController.getUserStats);

// --- ОФФЕРЫ ---
router.post('/setNewOffer', checkToken.checkToken, contestController.setNewOffer);
router.post('/setOfferStatus', checkToken.checkToken, contestController.setOfferStatus);
router.post('/updateContest', checkToken.checkToken, contestController.updateContest);
router.get('/downloadFile/:fileName', checkToken.checkToken, contestController.downloadFile);

// --- ВСЕ КОНКУРСЫ (например, для превью) ---
router.post('/getContests', checkToken.checkToken, contestController.getContests);

// --- ЧАТ ---
router.post('/getPreview', checkToken.checkToken, chatController.getPreview);
router.post('/getChat', checkToken.checkToken, chatController.getChat);
router.post('/addMessage', checkToken.checkToken, chatController.addMessage);
router.post('/blackList', checkToken.checkToken, chatController.blackList);
router.post('/favoriteChat', checkToken.checkToken, chatController.favoriteChat);
router.post('/createCatalog', checkToken.checkToken, chatController.createCatalog);
router.post('/updateNameCatalog', checkToken.checkToken, chatController.updateNameCatalog);
router.post('/addNewChatToCatalog', checkToken.checkToken, chatController.addNewChatToCatalog);
router.post('/removeChatFromCatalog', checkToken.checkToken, chatController.removeChatFromCatalog);
router.post('/deleteCatalog', checkToken.checkToken, chatController.deleteCatalog);
router.post('/getCatalogs', checkToken.checkToken, chatController.getCatalogs);

module.exports = router;
