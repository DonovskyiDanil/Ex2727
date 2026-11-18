const express = require('express');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const chatController = require('../controllers/chatController');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
<<<<<<< HEAD
const checkModerator = require('../middlewares/checkModerator');
const onlyForAdmin = require('../middlewares/onlyForAdmin');
const RightsError = require('../errors/RightsError');
const BadRequestError = require('../errors/BadRequestError');
const CONSTANTS = require('../constants');
const {
  uploadAvatar,
  uploadContestFile,
  uploadLogoFiles,
  updateContestFile,
} = require('../utils/fileUpload');
=======
const { uploadAvatar, uploadLogoFiles } = require('../utils/fileUpload');
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

const router = express.Router();

// --- АВТОРИЗАЦИЯ ---
router.post('/registration', hashPass, userController.registration);
router.post('/login', userController.login);
router.post('/getUser', checkToken.checkToken, userController.getUser);
<<<<<<< HEAD

// Moderators are restricted to offer review (and their own session identity).
router.get('/all-offers', checkToken.checkToken, checkModerator, contestController.getOffersModeration);
router.post('/change-offer-status', checkToken.checkToken, checkModerator, contestController.changeOfferStatus);
router.use(checkToken.checkToken);
router.post('/updateUser', uploadAvatar, userController.updateUser);
router.use((req, res, next) => {
  if (req.tokenData.role === CONSTANTS.MODERATOR) {
    return next(new RightsError('Moderators can only access offer moderation and their own profile'));
  }
  next();
});

// --- ОПЛАТА И КОНКУРСЫ ---
router.post(
  '/uploadContestFile',
  basicMiddlewares.onlyForCustomer,
  uploadContestFile,
  (req, res, next) => {
    if (!req.file) return next(new BadRequestError('An image file is required'));
    res.send({
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
    });
  },
);
router.post('/pay', basicMiddlewares.onlyForCustomer, userController.payment);
router.post(
  '/dataForContest',
  basicMiddlewares.onlyForCustomerOrCreator,
  contestController.dataForContest,
);
router.get('/customersContests', basicMiddlewares.onlyForCustomer, contestController.getCustomersContests);
router.get('/contestById', contestController.getContestById);

// --- СТАТИСТИКА И ПРОЧЕЕ ---
router.post('/changeMark', userController.changeMark);
router.post('/cashout', basicMiddlewares.onlyForCreative, userController.cashout);
router.get('/getUserStats', userController.getUserStats);

// --- ОФФЕРЫ ---
router.post('/setNewOffer', basicMiddlewares.onlyForCreative,
  uploadLogoFiles, contestController.setNewOffer);
router.post('/setOfferStatus', contestController.setOfferStatus);
// updateContest приходит как multipart/form-data, без multer req.body был пустым
router.post('/updateContest', basicMiddlewares.onlyForCustomer,
  updateContestFile, contestController.updateContest);
router.get('/downloadFile/:fileName', contestController.downloadFile);

// --- ВСЕ КОНКУРСЫ ---
router.post('/getContests', basicMiddlewares.onlyForCreative, contestController.getContests);

// --- ЧАТ ---
router.post('/getPreview', chatController.getPreview);
router.post('/getChat', chatController.getChat);
router.post('/addMessage', chatController.addMessage);
router.post('/blackList', chatController.blackList);
router.post('/favoriteChat', chatController.favoriteChat);

// --- КАТАЛОГИ ЧАТА ---
router.post('/getCatalogs', chatController.getCatalogs);
router.post('/createCatalog', chatController.createCatalog);
router.post('/updateNameCatalog', chatController.updateNameCatalog);
router.post('/addNewChatToCatalog', chatController.addNewChatToCatalog);
router.post('/removeChatFromCatalog', chatController.removeChatFromCatalog);
router.post('/deleteCatalog', chatController.deleteCatalog);

// --- ЗАВДАННЯ 7, 8, 9: УПРАВЛІННЯ КОРИСТУВАЧАМИ ---
router.get('/users/count-by-role', userController.getUsersCountByRole);
router.post('/cashback/holiday', onlyForAdmin, userController.applyHolidayCashback);
router.post('/creative/top-bonus', onlyForAdmin, userController.payTopCreatives);
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

module.exports = router;
