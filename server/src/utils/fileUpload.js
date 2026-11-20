const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const BadRequestError = require('../errors/BadRequestError');
const filePath = path.resolve(__dirname, '../../public/images');

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

const storageContestFiles = multer.diskStorage({
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

