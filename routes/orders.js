const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

// GET /orders - List all orders
router.get('/', ordersController.getAllOrders);

// POST /orders - Place an order (checkout)
router.post('/', ordersController.createOrder);

// GET /orders/:orderId - Get order details
router.get('/:id', ordersController.getOrder);

// PUT /orders/:orderId - Update order status
router.put('/:id', ordersController.updateOrder);

module.exports = router; 