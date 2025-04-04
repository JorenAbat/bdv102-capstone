-- Create Products table
CREATE TABLE Products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price FLOAT NOT NULL,
    stock_quantity INT NOT NULL
);

-- Create Shopping Cart table
CREATE TABLE Shopping_Cart (
    cart_id INT PRIMARY KEY,
    product_id INT,
    quantity INT NOT NULL,
    created_at DATE,
    updated_at DATE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Create Orders table
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    product_id INT,
    cart_id INT,
    quantity INT NOT NULL,
    order_date DATE,
    total_amount FLOAT NOT NULL,
    status VARCHAR(20),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (cart_id) REFERENCES Shopping_Cart(cart_id)
); 