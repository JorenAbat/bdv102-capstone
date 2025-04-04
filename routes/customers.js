const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers');

// GET /api/v1/customers - Get all customers
router.get('/', customerController.getAllCustomers);

// GET /api/v1/customers/:customerId - Get a single customer
router.get('/:customerId', customerController.getCustomerById);

// POST /api/v1/customers - Create a new customer
router.post('/', customerController.createCustomer);

// PUT /api/v1/customers/:customerId - Update a customer
router.put('/:customerId', customerController.updateCustomer);

// DELETE /api/v1/customers/:customerId - Delete a customer
router.delete('/:customerId', customerController.deleteCustomer);

module.exports = router; 