// backend/app.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const emailRoutes = require('./email'); // Import the email routes

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000', // Adjust based on your frontend's URL
}));
app.use(bodyParser.json());

// Connect to DB
const db = mysql.createConnection({
    host: process.env.DB_HOST, // Use environment variables
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Failed to connect to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

// Use the email routes
app.use('/api/email', emailRoutes);

// API for table menu
app.get('/api/menu', (req, res) => {
    const query = 'SELECT * FROM menu';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM menu WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(result[0]);  // Send the item details as a JSON response
    });
});


// Delete API for Inventory
app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM menu WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Item deleted successfully' });
    });
});

// Update API for Inventory
app.put('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const { item_name, description, price, category, SOH } = req.body;
    const query = 'UPDATE menu SET item_name = ?, description = ?, price = ?, category = ?, SOH = ? WHERE id = ?';

    db.query(query, [item_name, description, price, category, SOH, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Item updated successfully' });
    });
});

// Add API for Inventory
app.post('/api/menu', (req, res) => {
    const { item_name, description, price, category, SOH } = req.body;
    const query = 'INSERT INTO menu (item_name, description, price, category, SOH) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [item_name, description, price, category, SOH], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Item added successfully', id: result.insertId });
    });
});

app.get('/api/orderlist', (req, res) => {
    const query = 'SELECT * FROM orderlist';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500);
        }
        res.json(results);
    });
});

app.get('/api/orderdetail/:orderid', (req, res) => {
    const { orderid } = req.params;
    const query = 'SELECT * FROM orderdetail LEFT JOIN orderlist ON orderdetail.order_id = orderlist.order_id WHERE orderdetail.order_id = ?';
    db.query(query, [orderid], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/api/orderdetail/:id', (req, res) => {
    const { id } = req.params;
    // orderlist orderdetail
    const query = 'SELECT * FROM orderdetail LEFT JOIN orderlist ON orderdetail.order_id = orderlist.order_id WHERE orderdetail.item_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(result[0]);  // Send the item details as a JSON response
    });
});

app.delete('/api/order/:id', (req, res) => {
    const { id } = req.params;
    const query_detail = 'DELETE FROM orderdetail WHERE order_id = ?';
    const query = 'DELETE FROM orderlist WHERE order_id = ?';

    db.query(query_detail, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        db.query(query, [id], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ message: 'Item deleted successfully' });
        });
    });
});

app.put('/api/orderdetail/:id', (req, res) => {
    const { id } = req.params;
    const { orders } = req.body;
    
    orders.forEach(order => {
        const query = 'UPDATE orderdetail SET shipping_address = ?, instructions = ? WHERE order_id = ?';

        db.query(query, [order.shipping_address, order.instructions, id], (err, result) => {
            if (err) {
                return res.status(500)
            }
        });
    });

    res.json({ message: 'Orders updated successfully' });
});

// New endpoints for order status management
// These endpoints handle the order status updates
app.put('/api/orderStatus/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const query = 'UPDATE orderlist SET status = ? WHERE order_id = ?';
    
    db.query(query, [status, orderId], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ 
            message: 'Order status updated successfully',
            status: status
        });
    });
});

// Get current status of an order
app.get('/api/orderStatus/:orderId', (req, res) => {
    const { orderId } = req.params;
    
    const query = 'SELECT status FROM orderlist WHERE order_id = ?';
    
    db.query(query, [orderId], (err, result) => {
        if (err) {
            console.error('Error fetching order status:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ 
            orderId: orderId,
            status: result[0].status
        });
    });
});

// Get all orders with a specific status
app.get('/api/orders/status/:status', (req, res) => {
    const { status } = req.params;
    
    const query = 'SELECT * FROM orderlist WHERE status = ?';
    
    db.query(query, [status], (err, results) => {
        if (err) {
            console.error('Error fetching orders by status:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Restaurant login route
app.post('/api/restaurant/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM restaurant_user WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    });
});

app.get('/api/orders', (req, res) => {
    const query = `
        SELECT 
            od.order_id,
            u.Username AS user_name,
            m.item_name,
            od.quantity,
            o.status,
            o.createDate,
            od.instructions
        FROM 
            orderdetail od
        JOIN 
            orderlist o ON od.order_id = o.order_id
        JOIN 
            user u ON o.userid = u.id
        JOIN 
            menu m ON o.menu_id = m.id
        ORDER BY 
            o.createDate DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Route to update the status of an order
app.put('/api/order/update-status/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const query = 'UPDATE orderlist SET status = ? WHERE order_id = ?';
    
    db.query(query, [status, orderId], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ 
            message: 'Order status updated successfully',
            status: status
        });
    });
});

app.get('/api/orderdetail/:orderid', (req, res) => {
    const { orderid } = req.params;
    const query = `
        SELECT 
            od.order_id, od.price, od.quantity, od.subtotal, od.shipping_address, od.instructions,
            o.status, o.createDate,
            u.Username, u.Email, u.PhoneNumber, u.Address, u.RegistrationDate,
            m.item_name
        FROM 
            orderdetail od
        JOIN 
            orderlist o ON od.order_id = o.order_id
        JOIN 
            user u ON o.userid = u.id
        JOIN 
            menu m ON o.menu_id = m.id
        WHERE 
            od.order_id = ?
    `;

    db.query(query, [orderid], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(results[0]); // Return only the first result as there should be one order
    });
});

app.get('/api/orderdetailwithuser/:orderId', (req, res) => {
    const { orderId } = req.params;

    const query = `
        SELECT 
            o.order_id,
            o.quantity,
            o.status,
            o.createDate,
            od.price,
            od.subtotal,
            od.shipping_address,
            od.instructions,
            u.Username AS user_name,
            u.Email AS user_email,
            u.PhoneNumber AS user_phone
        FROM 
            orderlist o
        JOIN 
            orderdetail od ON o.order_id = od.order_id
        JOIN 
            user u ON o.userid = u.id
        WHERE 
            o.order_id = ?;
    `;

    db.query(query, [orderId], (err, results) => {
        if (err) {
            console.error('Error fetching order details with user info:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(results[0]); // Sending the first result as we expect a single order detail
    });
});

// submit order in cart page, transfer data from cart to order
app.post('/api/submit-order', (req, res) => {
    const { cart, userId, shippingAddress, instructions } = req.body; // Assuming userId and shippingAddress are also passed

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    // new orderlist in database
    const orderQuery = 'INSERT INTO orderlist (userid, createDate, status) VALUES (?, NOW(), "pending")';

    db.query(orderQuery, [userId], (err, orderResult) => {
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).json({ error: 'Database error creating order' });
        }

        const orderId = orderResult.insertId; // Get the newly created order ID

        // new orderdetail
        const orderDetailsQuery = `
            INSERT INTO orderdetail (order_id, price, quantity, subtotal, shipping_address, instructions)
            VALUES ?`;
        
        const orderDetailsData = cart.map(item => [
            orderId,
            item.price,
            item.quantity,
            item.price * item.quantity,
            shippingAddress,
            instructions
        ]);

        db.query(orderDetailsQuery, [orderDetailsData], (err, detailResult) => {
            if (err) {
                console.error('Error creating order details:', err);
                return res.status(500).json({ error: 'Database error creating order details' });
            }

            res.json({ message: 'Order submitted successfully!', orderId });
        });
    });
});
