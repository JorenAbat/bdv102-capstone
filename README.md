# E-Commerce Platform Backend

A Node.js backend implementation for an e-commerce platform using Express.js, Sequelize ORM, and PostgreSQL (hosted on neon.tech).

## Features

- RESTful API endpoints for product management
- Shopping cart functionality
- Order processing
- Customer management
- Database integration with neon.tech
- Error handling and validation

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL (neon.tech)
- REST API
- JSON data exchange

## Project Structure

```
capstone/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── sql/           # SQL scripts
└── server.js      # Main application file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- PostgreSQL database (neon.tech account)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   DATABASE_URL=your_neon_tech_database_url
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Documentation

### Products
- GET /api/products - List all products
- GET /api/products/:id - Get product details

### Customers
- GET /api/customers - List all customers
- GET /api/customers/:id - Get customer details
- POST /api/customers - Create new customer
- PUT /api/customers/:id - Update customer information
- DELETE /api/customers/:id - Remove customer

### Cart
- GET /api/cart?cart_id=X - Get cart contents
- POST /api/cart/items - Add item to cart
- PUT /api/cart/items/:id - Update cart item quantity
- DELETE /api/cart/items/:id - Remove item from cart

### Orders
- GET /api/orders - List all orders
- GET /api/orders/:id - Get order details
- POST /api/orders - Create new order from cart
- PUT /api/orders/:id - Update order status

## Testing

API tests are available in the `swiftcart.rest` file. Use the VS Code REST Client extension to run the tests.

## Error Handling

The API implements comprehensive error handling for:
- Invalid requests
- Database errors
- Authentication issues
- Resource not found
