const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

// GET /products - List all available products
router.get('/', productsController.getAllProducts);

// GET /products/:productId - Get a specific product by ID
router.get('/:productId', productsController.getProductById);

module.exports = router; 