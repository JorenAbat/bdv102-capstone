# E-Commerce Platform Backend

A Node.js backend implementation for an e-commerce platform using Express.js, Sequelize ORM, and PostgreSQL (hosted on neon.tech).

## Features

- RESTful API endpoints for product management
- Shopping cart functionality
- Order processing
- Customer management
- Database integration with neon.tech
- Error handling and validation
- Docker containerization for easy deployment

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL (neon.tech)
- REST API
- JSON data exchange
- Docker

## Project Structure

```
capstone/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── sql/           # SQL scripts
├── Dockerfile     # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── server.js      # Main application file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- PostgreSQL database (neon.tech account)
- Docker (for containerization)

## Setup Instructions

### Local Setup

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

### Docker Setup

1. Clone the repository
2. Build the Docker image:
   ```bash
   docker build -t swiftcart-api .
   ```
3. Run the container:
   ```bash
   docker run -p 3000:3000 -e DATABASE_URL=your_neon_tech_database_url swiftcart-api
   ```

### Docker Compose Setup

1. Clone the repository
2. Create a .env file with the required environment variables
3. Run the container using Docker Compose:
   ```bash
   docker-compose up
   ```

## API Documentation

### Products
- GET /api/v1/products - List all products
- GET /api/v1/products/:id - Get product details

### Customers
- GET /api/v1/customers - List all customers
- GET /api/v1/customers/:id - Get customer details
- POST /api/v1/customers - Create new customer
- PUT /api/v1/customers/:id - Update customer information
- DELETE /api/v1/customers/:id - Remove customer

### Cart
- GET /api/v1/cart?cart_id=X - Get cart contents
- POST /api/v1/cart/items - Add item to cart
- PUT /api/v1/cart/items/:id - Update cart item quantity
- DELETE /api/v1/cart/items/:id - Remove item from cart

### Orders
- GET /api/v1/orders - List all orders
- GET /api/v1/orders/:id - Get order details
- POST /api/v1/orders - Create new order from cart
- PUT /api/v1/orders/:id - Update order status

## Testing

API tests are available in the `swiftcart.rest` file. Use the VS Code REST Client extension to run the tests.

## Error Handling

The API implements comprehensive error handling for:
- Invalid requests
- Database errors
- Authentication issues
- Resource not found

## Docker Hub

The Docker image is available on Docker Hub:
```
jorenabat/swiftcart-api:latest
```

To pull and run the image:
```bash
docker pull jorenabat/swiftcart-api:latest
docker run -p 3000:3000 -e DATABASE_URL=your_neon_tech_database_url jorenabat/swiftcart-api:latest
```
