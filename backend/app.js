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

/// API to transfer cart data to orderlist and update SOH in the menu table
app.post('/api/submit-order', (req, res) => {
    // Immediately send response back to frontend with the message
    res.json({
        message: 'Order has been submitted. Please enter your payment detail at the next page.'
    });

    // Continue with the transaction to handle the order submission
    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            console.error('Error starting transaction:', transactionErr);
            return;
        }

        const insertOrderQuery = `
            INSERT INTO orderlist (cart_id, menu_id, quantity)
            SELECT cart_id, menu_id, quantity FROM cart
        `;

        db.query(insertOrderQuery, (insertErr, result) => {
            if (insertErr) {
                console.error('Error inserting order:', insertErr);
                return db.rollback(() => {
                    console.error('Transaction rollback due to order insert error');
                });
            }

            const updateSohQuery = `
                UPDATE menu
                SET SOH = SOH - 1
                WHERE id IN (SELECT menu_id FROM cart)
                  AND SOH > 0  -- To prevent negative SOH
            `;

            db.query(updateSohQuery, (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Error updating SOH:', updateErr);
                    return db.rollback(() => {
                        console.error('Transaction rollback due to SOH update error');
                    });
                }

                db.commit((commitErr) => {
                    if (commitErr) {
                        console.error('Error committing transaction:', commitErr);
                        return db.rollback(() => {
                            console.error('Transaction rollback due to commit error');
                        });
                    }
                    console.log('Order submitted and SOH updated successfully');
                });
            });
        });
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


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
