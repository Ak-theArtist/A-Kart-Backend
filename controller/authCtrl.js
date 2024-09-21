const bcrypt = require('bcryptjs');
const ProductsModel = require('../models/Products');
const UserModel = require('../models/Users');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../middlewares/sendMail');
const { ObjectId } = require('mongoose').Types;
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');

// Other code here...

// API endpoint to get current user's role and name
const adminInfo = async (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    res.json({ name: req.name, role: req.role });
};

const superAdmin = async (req, res) => {
    res.json({ message: 'Welcome, Super Admin!' });
};


const me = async (req, res) => {
    UserModel.findOne({ email: req.email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
};


// Make a user an admin
const makeAdmin = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'admin';
        await user.save();

        console.log('User role updated to admin', user);
        res.status(200).json({ message: 'User role updated to admin', user });
    } catch (err) {
        console.error('Error in makeAdmin:', err);
        res.status(500).json({ message: err.message });
    }
};

const revertAdmin = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'user';
        await user.save();

        console.log('User role reverted to user', user);
        res.status(200).json({ message: 'User role reverted to user', user });
    } catch (err) {
        console.error('Error in revertAdmin:', err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("Removed");
        res.json({
            success: true,
            name: user.name
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all users
const getAllusers = async (req, res) => {
    UserModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
};
// New collections
const newcollections = async (req, res) => {
    try {
        let products = await ProductsModel.find({});
        let arr = products.slice(-10);
        console.log("New Collections");
        res.send(arr);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Popular in men
const popularinMen = async (req, res) => {
    try {
        let products = await ProductsModel.find({ category: "men" });
        let arr = products.slice(0, 5);
        console.log("Popular In Men");
        res.send(arr);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Popular in women
const popularinWomen = async (req, res) => {
    try {
        let products = await ProductsModel.find({ category: "women" });
        let arr = products.slice(0, 5);
        console.log("Popular In Women");
        res.send(arr);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addToCart = async (req, res) => {
    try {
        const id = req.params.id;
        const { productId } = req.body;

        const user = await UserModel.findById(id);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await ProductsModel.findById(productId);
        if (!product) {
            console.error('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }
        const cartItem = user.cartData.find(item => item.productId.toString() === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cartData.push({ productId, quantity: 1 });
        }

        await user.save();
        console.log('Cart updated:', user.cartData);

        return res.status(200).json({ cart: user.cartData });
    } catch (error) {
        console.error('Error in addToCart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const removefromCart = async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.cartData = user.cartData.filter(item => item.productId.toString() !== productId);
        await user.save();

        res.json({ cart: user.cartData });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUserCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ cart: user.cartData });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Logout
const logout = async (req, res) => {
    res.clearCookie('token');
    return res.json('Success');
};

// Register
const register = async (req, res) => {
    const { name, email, password } = req.body;

    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(409).json({ error: 'Email is already registered' });
            }
            bcrypt.hash(password, 10)
                .then(hash => {
                    let cart = {};
                    for (let i = 0; i < 300; i++) {
                        cart[i] = 0;
                    }

                    UserModel.create({ name, email, password: hash })
                        .then(user => {
                            const token = jwt.sign(
                                { email: user.email, name: user.name, role: user.role },
                                "jwt-secret-key",
                                { expiresIn: "1d" }
                            );

                            res.cookie('token', token, { httpOnly: true });
                            sendMail(user.email, "Welcome", `Hi ${user.name}, thank you for exploring A-Kart!`)

                            return res.status(201).json({ message: 'User registered successfully', token });
                        })
                        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
                })
                .catch(err => res.status(500).json({ error: 'Error hashing password' }));
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
};

// OTP system
const generateOTP = () => {
    return crypto.randomBytes(3).toString('hex'); 
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    console.log('Received OTP verification request:', { email, otp });
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required.' });
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.error('User not found for email:', email);
            return res.status(400).json({ error: 'Invalid email or OTP.' });
        }
        console.log('User found:', user);
        if (user.resetPasswordOTP !== otp) {
            console.error('Invalid OTP for user:', email);
            return res.status(400).json({ error: 'Invalid OTP.' });
        }
        if (user.resetPasswordExpires < Date.now()) {
            console.error('Expired OTP for user:', email);
            return res.status(400).json({ error: 'OTP expired.' });
        }
        res.json({ message: 'OTP verified successfully' });
    } catch (err) {
        console.error('Error in verifyOTP:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user || user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error in updatePassword:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();
        await sendMail(user.email, 'Password Reset OTP', `Your OTP for password reset is ${otp}`);
        res.json({ message: 'OTP sent to your email' });
    } catch (err) {
        console.error('Error in forgotPassword:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            bcrypt.compare(password, user.password, (err, response) => {
                if (err || !response) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
                const token = jwt.sign(
                    { email: user.email, name: user.name, role: user.role },
                    "jwt-secret-key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token, { httpOnly: true });
                return res.status(200).json({ token });
            });
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
};

const updateProfile = async (req, res) => {
    console.log('Received data:', req.body);
    const { userId, name, email, address, gender, mobileNumber, pincode } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    if (pincode && !/^\d{6}$/.test(pincode)) {
        return res.status(400).json({ error: 'Pincode must be 6 digits' });
    }
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email, address, gender, mobileNumber, ...(pincode ? { pincode } : {}) },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getUserDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id).populate('orders');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user details',
        });
    }
};

const addAddress = async (req, res) => {
    try {
        const { userId, address, pincode } = req.body;
        console.log('Request Data:', { userId, address, pincode });

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        if (!Array.isArray(address) || !Array.isArray(pincode)) {
            return res.status(400).json({ message: 'Address and pincode must be arrays' });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.address = address;
        user.pincode = pincode;

        await user.save();

        res.status(200).json({ message: 'Address and pincode updated successfully' });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const deleteAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressIndex = user.address.indexOf(address);
        if (addressIndex === -1) {
            return res.status(400).json({ message: 'Address not found' });
        }

        user.address.splice(addressIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deletePincode = async (req, res) => {
    try {
        const { userId, pincode } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const pincodeIndex = user.pincode.indexOf(pincode);
        if (pincodeIndex === -1) {
            return res.status(400).json({ message: 'Pincode not found' });
        }
        user.pincode.splice(pincodeIndex, 1);
        await user.save();
        res.status(200).json({ message: 'Pincode deleted successfully' });
    } catch (error) {
        console.error('Error deleting pincode:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserAddresses = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel.findById(userId).select('address'); 
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, addresses: user.address }); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while fetching addresses', error });
    }
};

module.exports = {
    register,
    forgotPassword,
    verifyOTP,
    updatePassword,
    login,
    logout,
    addToCart,
    removefromCart,
    getUserCart,
    newcollections,
    popularinMen,
    popularinWomen,
    me,
    superAdmin,
    makeAdmin,
    adminInfo,
    revertAdmin,
    deleteUser,
    getAllusers,
    updateProfile,
    getUserDetails,
    addAddress,
    deleteAddress,
    deletePincode,
    getUserAddresses,
};