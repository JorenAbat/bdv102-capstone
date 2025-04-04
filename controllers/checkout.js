// Import the database model
const db = require('../models/db');

// Process checkout
exports.processCheckout = async (req, res) => {
  try {
    // Get current cart
    const cart = await db.getCart();
    
    // If cart is empty
    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot checkout with an empty cart'
      });
    }
    
    // Extract checkout information from request body
    const { shippingAddress, paymentMethod } = req.body;
    
    // Validate required fields
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }
    
    // Create order data
    const orderData = {
      items: cart.items,
      total: cart.total,
      shippingAddress,
      paymentMethod
    };
    
    // Create order in database
    const order = await db.createOrder(orderData);
    
    // Clear the cart
    await db.clearCart();
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 