const { Cart, CartItem, Product, sequelize } = require('../models');

// Get cart contents
const getCartContents = async (req, res) => {
    try {
        const { cart_id } = req.query;

        if (!cart_id) {
            return res.status(400).json({
                success: false,
                message: 'Cart ID is required'
            });
        }

        const cart = await Cart.findOne({
            where: { cart_id },
            include: [{
                model: CartItem,
                include: [Product]
            }]
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Transform the response to match the expected format
        const cartData = {
            cart_id: cart.cart_id,
            items: cart.CartItems.map(item => ({
                cart_item_id: item.cart_item_id,
                product_id: item.product_id,
                quantity: item.quantity,
                product: item.Product
            }))
        };

        res.json({
            success: true,
            data: cartData
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart',
            error: error.message
        });
    }
};

// Add item to cart
const addItemToCart = async (req, res) => {
    // Start a transaction to handle concurrent users
    const transaction = await sequelize.transaction();
    
    try {
        const { product_id, quantity, cart_id } = req.body;

        if (!cart_id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart ID is required'
            });
        }

        // Validate product exists
        const product = await Product.findByPk(product_id, { transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Get cart with optimistic locking
        const cart = await Cart.findByPk(cart_id, { transaction });
        if (!cart) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Check if item already exists in cart
        let cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.cart_id,
                product_id: product_id
            },
            transaction
        });

        if (cartItem) {
            // Update quantity if item exists
            cartItem.quantity += quantity;
            await cartItem.save({ transaction });
        } else {
            // Create new cart item
            cartItem = await CartItem.create({
                cart_id: cart.cart_id,
                product_id: product_id,
                quantity: quantity
            }, { transaction });
        }

        // Increment cart version to handle concurrent updates
        await cart.increment('version', { transaction });

        // Commit the transaction
        await transaction.commit();

        // Fetch updated cart item with product details
        const updatedCartItem = await CartItem.findOne({
            where: { cart_item_id: cartItem.cart_item_id },
            include: [Product]
        });

        res.json({
            success: true,
            data: {
                cart_item_id: updatedCartItem.cart_item_id,
                product_id: updatedCartItem.product_id,
                quantity: updatedCartItem.quantity,
                product: updatedCartItem.Product
            }
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        
        console.error('Error adding item to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    // Start a transaction to handle concurrent users
    const transaction = await sequelize.transaction();
    
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const cartItem = await CartItem.findByPk(id, {
            include: [Product],
            transaction
        });

        if (!cartItem) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // Get the cart with optimistic locking
        const cart = await Cart.findByPk(cartItem.cart_id, { transaction });
        
        cartItem.quantity = quantity;
        await cartItem.save({ transaction });
        
        // Increment cart version to handle concurrent updates
        await cart.increment('version', { transaction });

        // Commit the transaction
        await transaction.commit();

        res.json({
            success: true,
            data: {
                cart_item_id: cartItem.cart_item_id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                product: cartItem.Product
            }
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        
        console.error('Error updating cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart item',
            error: error.message
        });
    }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
    // Start a transaction to handle concurrent users
    const transaction = await sequelize.transaction();
    
    try {
        const { id } = req.params;

        const cartItem = await CartItem.findByPk(id, { transaction });
        if (!cartItem) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // Get the cart with optimistic locking
        const cart = await Cart.findByPk(cartItem.cart_id, { transaction });
        
        await cartItem.destroy({ transaction });
        
        // Increment cart version to handle concurrent updates
        await cart.increment('version', { transaction });

        // Commit the transaction
        await transaction.commit();

        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        
        console.error('Error removing cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing cart item',
            error: error.message
        });
    }
};

module.exports = {
    getCartContents,
    addItemToCart,
    updateCartItem,
    removeCartItem
}; 