const OrderModel = require('../models/Orders');
const mongoose = require('mongoose');
const UserModel = require('../models/Users');

const success = (status, data) => ({ status, success: true, data });
const error = (status, message) => ({ status, success: false, message });


const clearCart = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Clear the cart
        user.cartData = [];
        await user.save();

        console.log('Cart cleared for user:', userId);
        return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
        console.error('Error clearing cart:', error);
        return { success: false, message: 'Error clearing cart' };
    }
};


const createOrder = async (req, res) => {
    console.log('Request body:', req.body);

    try {
        const { userId, items, totalAmount, paymentMethod, address, pincode, status } = req.body;
        if (!userId || !items || !totalAmount || !paymentMethod || !address || !pincode) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        const order = await OrderModel.create({
            userId,
            items,
            totalAmount,
            paymentMethod,
            address,
            pincode,
            status: status || 'pending',
        });

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

         // Clear the cart after order is placed
         const clearCartResponse = await clearCart(userId);
         if (!clearCartResponse.success) {
             return res.status(500).json({ error: 'Error clearing cart after order' });
         }

        user.orders.push(order._id);
        await user.save();

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the order',
        });
    }
};


const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields',
        });
    }
    try {
        const order = await OrderModel.findByIdAndUpdate(id, {
            status,
        }, { new: true });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the order',
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const removeOrder = async (req, res) => {
    try {
        const { id } = req.body;
        await OrderModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Order removed successfully',
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const allOrders = async (req, res) => {
    try {
        let orders = await OrderModel.find({});
        res.send(orders);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOrdersForUser = async (req, res) => {
    try {
        const orders = await OrderModel.find({ userId: req.query.userId })
            .populate({
                path: 'items.productId',
                model: 'posts',
                select: 'name image'
            })
            .exec();

        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

module.exports = {
    createOrder,
    updateOrder,
    getOrderById,
    removeOrder,
    allOrders,
    getOrdersForUser,
    clearCart,
};
