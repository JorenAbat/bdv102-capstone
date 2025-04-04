const sequelize = require('../config/database');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const Customer = require('./Customer');

// Define relationships
Cart.hasMany(CartItem, {
  foreignKey: 'cart_id',
  onDelete: 'CASCADE'
});
CartItem.belongsTo(Cart, {
  foreignKey: 'cart_id'
});

Product.hasMany(CartItem, {
  foreignKey: 'product_id'
});
CartItem.belongsTo(Product, {
  foreignKey: 'product_id'
});

// Cart and Order relationships
Cart.hasOne(Order, {
  foreignKey: 'cart_id',
  onDelete: 'CASCADE'
});
Order.belongsTo(Cart, {
  foreignKey: 'cart_id'
});

// Customer relationships
Customer.hasMany(Cart, {
  foreignKey: 'customer_id'
});
Cart.belongsTo(Customer, {
  foreignKey: 'customer_id'
});

// Product relationships with Cart through CartItem
Cart.belongsToMany(Product, {
  through: CartItem,
  foreignKey: 'cart_id'
});
Product.belongsToMany(Cart, {
  through: CartItem,
  foreignKey: 'product_id'
});

module.exports = {
  sequelize,
  Product,
  Cart,
  CartItem,
  Order,
  Customer
}; 