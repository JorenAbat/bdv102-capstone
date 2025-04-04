const { Cart, CartItem, Order, Product, sequelize } = require('../models');

// Create a new order
const createOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        // Get cart_id from request body
        const { cart_id } = req.body;
        
        if (!cart_id) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart ID is required'
            });
        }

        // Use optimistic locking to handle concurrent users
        const cart = await Cart.findOne({
            where: { cart_id },
            include: [{
                model: CartItem,
                required: true,
                include: [{
                    model: Product,
                    required: true
                }]
            }],
            lock: true,
            transaction: t
        });

        if (!cart || cart.CartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart is empty or not found'
            });
        }

        // Calculate total amount
        const totalAmount = cart.CartItems.reduce((sum, item) => {
            return sum + (item.Product.price * item.quantity);
        }, 0);

        // Create order
        const order = await Order.create({
            cart_id: cart.cart_id,
            total_amount: totalAmount,
            status: 'PENDING'
        }, { transaction: t });

        // Update product stock quantities with optimistic locking
        for (const item of cart.CartItems) {
            const product = await Product.findByPk(item.Product.product_id, {
                lock: true,
                transaction: t
            });
            
            const newStockQuantity = product.stock_quantity - item.quantity;
            
            if (newStockQuantity < 0) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.name}`
                });
            }

            await product.update(
                { stock_quantity: newStockQuantity },
                { transaction: t }
            );
        }

        // Clear the cart items
        await CartItem.destroy({
            where: { cart_id: cart.cart_id },
            transaction: t
        });

        // Increment cart version to handle concurrent updates
        await cart.increment('version', { transaction: t });

        await t.commit();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        await t.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get order by ID
const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id, {
            include: [{
                model: Cart,
                include: [{
                    model: CartItem,
                    include: [Product]
                }]
            }]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: Cart,
        include: [{
          model: CartItem,
          include: [Product]
        }]
      }]
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Update order status
const updateOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED'];
        if (!validStatuses.includes(status)) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: PENDING, SHIPPED, DELIVERED'
            });
        }

        // Find the order with optimistic locking
        const order = await Order.findByPk(id, {
            lock: true,
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update the order status
        await order.update({ status }, { transaction: t });

        await t.commit();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        await t.rollback();
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
};

module.exports = {
    getAllOrders,
    createOrder,
    getOrder,
    updateOrder
}; 