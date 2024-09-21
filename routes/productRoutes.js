const express = require('express');
const router = express.Router();
const { createProduct, removeProduct, allProducts, editProduct, getProductById, updateImage1, updateImage2, updateImage3, updateImage4 } = require('../controller/productCtrl');
const uploadMiddleware = require('../middlewares/multerWare');

router.post('/addproduct', uploadMiddleware.array('image', 4), createProduct);
router.put('/updateimage1/:id', uploadMiddleware.single('image', 1), updateImage1);
router.put('/updateimage2/:id', uploadMiddleware.single('image', 1), updateImage2);
router.put('/updateimage3/:id', uploadMiddleware.single('image', 1), updateImage3);
router.put('/updateimage4/:id', uploadMiddleware.single('image', 1), updateImage4);
router.put('/editproduct/:id', editProduct);
router.post('/removeproduct', removeProduct);
router.get('/allproducts', allProducts);
router.get('/:id', getProductById);

module.exports = router;
