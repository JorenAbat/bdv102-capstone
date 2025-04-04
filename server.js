const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Import database and models
const { sequelize } = require('./models');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const customersRouter = require('./routes/customers');

// API versioning
const apiRouter = express.Router();

// Mount routes under /api/v1
apiRouter.use('/products', productsRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/customers', customersRouter);

app.use('/api/v1', apiRouter);

// Basic route for root
app.get('/', (req, res) => {
    res.send('Welcome to Swiftcart API');
});

// Sync database
sequelize.sync()
    .then(() => {
        console.log('Database synced successfully');
        // Start the server
        app.listen(port, () => {
            console.log(`Swiftcart server listening on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Error syncing database:', error);
    }); 