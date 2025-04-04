const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout');

// POST /checkout - Process checkout
router.post('/', checkoutController.processCheckout);

module.exports = router; 