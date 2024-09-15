import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Inventory() {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/menu')
            .then(response => {
                setMenuItems(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div className="inventory-container">
            <h2>Inventory</h2>
            <table className="inventory-table">
                <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Price ($)</th>
                    <th>Category</th>
                    <th>Stock on Hand (SOH)</th>
                </tr>
                </thead>
                <tbody>
                {menuItems.map(item => (
                    <tr key={item.id}>
                        <td>{item.item_name}</td>
                        <td>{item.description}</td>
                        <td>{parseFloat(item.price).toFixed(2)}</td>
                        <td>{item.category}</td>
                        <td>{item.SOH}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Inventory;
