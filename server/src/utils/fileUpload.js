const fs = require('fs');
const path = require('path');
<<<<<<< HEAD
const crypto = require('crypto');
const multer = require('multer');
const BadRequestError = require('../errors/BadRequestError');
const filePath = path.resolve(__dirname, '../../public/images');
=======
const multer = require('multer');
const ServerError = require('../errors/ServerError');
const env = process.env.NODE_ENV || 'development';
const devFilePath = path.join(process.cwd(), 'public', 'images');

const filePath = env === 'production'
  ? '/var/www/html/images'
  : devFilePath;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

const storageContestFiles = multer.diskStorage({
<<<<<<< HEAD
  destination(req, file, cb) {
    cb(null, filePath);
  },
  filename(req, file, cb) {
    cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const upload = multer({
  storage: storageContestFiles,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
  fileFilter(req, file, cb) {
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    cb(null, allowedTypes.has(file.mimetype));
  },
});
const uploadAvatars = upload.single('file');
const uploadContestFiles = upload.array('files', 3);
const uploadContestFile = upload.single('file');
const updateContestFile = upload.single('file');
const uploadLogoFiles = upload.single('offerData');

const handleUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(
        err instanceof multer.MulterError ? 'Uploaded file is too large' : 'File upload failed'
      ));
    }
    next();
  });
};

module.exports.uploadAvatar = handleUpload(uploadAvatars);
module.exports.uploadContestFiles = handleUpload(uploadContestFiles);
module.exports.uploadContestFile = handleUpload(uploadContestFile);
module.exports.updateContestFile = handleUpload(updateContestFile);
module.exports.uploadLogoFiles = handleUpload(uploadLogoFiles);
=======
  destination (req, file, cb) {
    cb(null, filePath);
  },
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadAvatars = multer({ storage: storageContestFiles }).single('file');
const uploadContestFiles = multer({ storage: storageContestFiles }).array(
  'files', 3);
const updateContestFile = multer({ storage: storageContestFiles }).single(
  'file');
const uploadLogoFiles = multer({ storage: storageContestFiles }).single(
  'offerData');

module.exports.uploadAvatar = (req, res, next) => {
  uploadAvatars(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.uploadContestFiles = (req, res, next) => {
  uploadContestFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.updateContestFile = (req, res, next) => {
  updateContestFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.uploadLogoFiles = (req, res, next) => {
  uploadLogoFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

