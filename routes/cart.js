const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

// GET /cart - Get current cart contents
router.get('/', cartController.getCartContents);

// POST /cart/items - Add item to cart
router.post('/items', cartController.addItemToCart);

// PUT /cart/items/:id - Update item quantity in cart
router.put('/items/:id', cartController.updateCartItem);

// DELETE /cart/items/:id - Remove item from cart
router.delete('/items/:id', cartController.removeCartItem);

module.exports = router; 