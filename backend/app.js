const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost', // Don't change
    user: 'root', // Username
    password: 'crh030417', // Password
    database: 'restaurant' // Database Name
});


db.connect(err => {
    if (err) {
        console.error('File to connect to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

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


app.listen(port, () => {
    console.log(`Port ${port}`);
});
