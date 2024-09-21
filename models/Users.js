const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'posts'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    address: [{
        type: String,
        default: []
    }],
    gender: {
        type: String,
        default: 'Male'
    },
    mobileNumber: {
        type: String,
        default: ''
    },
    pincode: [{
        type: String,
        validate: {
            validator: function(value) {
                return value === '' || /^\d{6}$/.test(value); 
            },
            message: 'Invalid pincode format'
        },
        default: ''
    }],
    date: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordOTP: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: Date.now
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }],
    otp: {
        type: String,
        default: ''
    },
    otpExpires: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
