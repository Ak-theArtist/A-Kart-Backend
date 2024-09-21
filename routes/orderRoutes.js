const express = require('express');
const router = express.Router();
const { createOrder, updateOrder, getOrderById, removeOrder, allOrders, getOrdersForUser, clearCart } = require('../controller/orderCtrl');

router.post('/createorder', createOrder);
router.put('/updateorder/:id', updateOrder);
router.get('/order/:id', getOrderById);
router.delete('/removeorder', removeOrder);
router.get('/allorders', allOrders);
router.get('/ordersforuser', getOrdersForUser);
router.delete('/clearcart/:userId', clearCart);


module.exports = router;
