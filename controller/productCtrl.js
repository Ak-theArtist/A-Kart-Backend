const ProductsModel = require('../models/Products');
const IMG_BASE_URL = process.env.REACT_APP_IMG_BASE_URL;
const mongoose = require('mongoose');

const success = (status, data) => ({ status, success: true, data });
const error = (status, message) => ({ status, success: false, message });

const createProduct = async (req, res) => {
    try {
        const { name, category, new_price, old_price, description } = req.body;
        let image = req.files;

        if (!name || !image || !new_price || !old_price || !description) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        const imageUrls = req.files.map(file => IMG_BASE_URL + file.filename);
        const product = await ProductsModel.create({
            name,
            image: imageUrls,
            category: category || 'men',
            new_price,
            old_price,
            description,
        });
        await product.save();
        res.json({
            product
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while adding the product',
        });
    }
};


const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, new_price, old_price, description } = req.body;

    if (!name || !new_price || !old_price || !description) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields',
        });
    }
    try {
        const product = await ProductsModel.findByIdAndUpdate(id, {
            name,
            category: category || 'men',
            new_price,
            old_price,
            description,
        }, { new: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error('Error editing product:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while editing the product',
        });
    }
};


const updateImage = async (req, res, imageIndex) => {
    try {
        const id = req.params.id;
        const image = IMG_BASE_URL + req.file.filename;

        let product = await ProductsModel.findById(id);
        if (!product.image) {
            product.image = [];
        }
        product.image[imageIndex] = image;

        const updatedProduct = await ProductsModel.findOneAndUpdate(
            { _id: id },
            { $set: { image: product.image } },
            { new: true }
        );
        await product.save();

        return res.json(success(200, { updatedProduct }));
    } catch (e) {
        return res.json(error(500, e.message));
    }
};

const updateImage1 = (req, res) => updateImage(req, res, 0);
const updateImage2 = (req, res) => updateImage(req, res, 1);
const updateImage3 = (req, res) => updateImage(req, res, 2);
const updateImage4 = (req, res) => updateImage(req, res, 3);

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductsModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the product',
        });
    }
};

const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        await ProductsModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Product removed successfully',
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const allProducts = async (req, res) => {
    try {
        let products = await ProductsModel.find({});
        let arr = products;
        console.log("New Collections");
        res.send(arr);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createProduct,
    editProduct,
    updateImage1,
    updateImage2,
    updateImage3,
    updateImage4,
    getProductById,
    removeProduct,
    allProducts,
};
