const { Customer, Cart, CartItem, Order, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.customerId, {
      include: [{
        model: Cart,
        attributes: ['cart_id']
      }]
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${req.params.customerId} not found`
      });
    }
    
    // Format the response to include cart_id at the top level
    const responseData = {
      ...customer.toJSON(),
      cart_id: customer.Carts && customer.Carts[0] ? customer.Carts[0].cart_id : null
    };
    delete responseData.Carts;  // Remove the nested Carts array
    
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    
    // Create a cart for the new customer
    const cart = await Cart.create({
      customer_id: customer.customer_id
    });
    
    res.status(201).json({
      success: true,
      data: {
        customer,
        cart_id: cart.cart_id
      }
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message
    });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.customerId);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${req.params.customerId} not found`
      });
    }
    
    await customer.update(req.body);
    
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customer',
      error: error.message
    });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const customer = await Customer.findByPk(req.params.customerId, {
      include: [{
        model: Cart,
        include: [{
          model: CartItem
        }, {
          model: Order
        }]
      }],
      transaction: t
    });
    
    if (!customer) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${req.params.customerId} not found`
      });
    }

    // First, delete all orders associated with customer's carts
    for (const cart of customer.Carts) {
      if (cart.Orders && cart.Orders.length > 0) {
        await Order.destroy({
          where: { cart_id: cart.cart_id },
          transaction: t
        });
      }
    }

    // Then delete all cart items
    for (const cart of customer.Carts) {
      if (cart.CartItems && cart.CartItems.length > 0) {
        await CartItem.destroy({
          where: { cart_id: cart.cart_id },
          transaction: t
        });
      }
    }

    // Now we can safely delete all carts
    await Cart.destroy({
      where: { customer_id: customer.customer_id },
      transaction: t
    });
    
    // Finally, delete the customer
    await customer.destroy({ transaction: t });
    
    await t.commit();
    
    res.status(200).json({
      success: true,
      message: 'Customer and associated data deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message
    });
  }
}; 