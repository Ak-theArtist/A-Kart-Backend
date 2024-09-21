const multer = require('multer');
const path = require('path');

const mstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload/images");
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: mstorage });

module.exports = upload;