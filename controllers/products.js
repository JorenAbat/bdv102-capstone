const { Product } = require('../models');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${req.params.productId} not found`
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById
}; 