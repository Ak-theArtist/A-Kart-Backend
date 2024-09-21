const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    id: {
        type: Number,
        // required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: [String],
        required: true,
    },
    category: {
        type: String,
        default: 'men',
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

const ProductsModel = mongoose.model('posts', ProductsSchema);

module.exports = ProductsModel;
 