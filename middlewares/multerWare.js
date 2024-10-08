const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig.js');  

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'A-Kart_images', 
    allowed_formats: ['jpg', 'png', 'jpeg'], 
  },
});

const upload = multer({ storage });

module.exports = upload;
