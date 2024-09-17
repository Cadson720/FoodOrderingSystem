// src/Inventory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Inventory() {
    const [menuItems, setMenuItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);  // 当前编辑的项ID
    const [editedItem, setEditedItem] = useState({});  // 当前编辑的项内容
    const [isAddingNew, setIsAddingNew] = useState(false);  // 是否正在添加新项

    useEffect(() => {
        fetchMenuItems();
    }, []);

    // Get Menu
    const fetchMenuItems = () => {
        axios.get('http://localhost:3001/api/menu')
            .then(response => {
                setMenuItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching menu items:', error);
            });
    };

    // Edit
    const handleModify = (item) => {
        setEditingItemId(item.id);
        setEditedItem(item);
    };

    // Add
    const handleAddItem = () => {
        setIsAddingNew(true);
        setEditedItem({ item_name: '', description: '', price: '', category: '', SOH: '' });  // 初始化新项
    };

    // Validate
    const validateInput = (item) => {
        if (!item.item_name || !item.category || item.SOH === '') {
            return "Item name, category, and stock on hand are required.";
        }
        if (isNaN(item.price) || parseFloat(item.price) <= 0) {
            return "Price must be a valid number greater than 0.";
        }
        if (!Number.isInteger(Number(item.SOH)) || Number(item.SOH) < 0) {
            return "Stock on Hand (SOH) must be a valid non-negative integer.";
        }
        return null; // null means pass
    };

    // Confirm and send to database
    const handleConfirm = (id) => {
        const validationError = validateInput(editedItem);
        if (validationError) {
            alert(validationError);  // Show alert
            return;
        }

        // If adding
        if (isAddingNew) {
            axios.post('http://localhost:3001/api/menu', editedItem)
                .then(response => {
                    console.log('Item added successfully');
                    fetchMenuItems();  // Get menu again
                    setIsAddingNew(false);  // Exit
                    setEditedItem({});
                })
                .catch(error => {
                    console.error('Error adding item:', error);
                });
        } else {  // If modifying
            axios.put(`http://localhost:3001/api/menu/${id}`, editedItem)
                .then(response => {
                    console.log('Item updated successfully');
                    // Update menu and exit
                    setMenuItems(menuItems.map(item => (item.id === id ? editedItem : item)));
                    setEditingItemId(null);
                    setEditedItem({});
                })
                .catch(error => {
                    console.error('Error updating item:', error);
                });
        }
    };

    // Cancel
    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingItemId(null);
        setEditedItem({});
    };

    // Delete handling with database
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            axios.delete(`http://localhost:3001/api/menu/${id}`)
                .then(response => {
                    setMenuItems(menuItems.filter(item => item.id !== id));
                    console.log('Item deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                });
        }
    };

    // Input textbox
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedItem({ ...editedItem, [name]: value });
    };

    return (
        <div className="inventory-container">
            <h2>Inventory</h2>
            <button onClick={handleAddItem}>Add Item</button>
            <table className="inventory-table">
                <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Price ($)</th>
                    <th>Category</th>
                    <th>Stock on Hand (SOH)</th>
                    <th>Modify</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {/* If adding, add a new empty row */}
                {isAddingNew && (
                    <tr>
                        <td><input type="text" name="item_name" value={editedItem.item_name} onChange={handleInputChange} /></td>
                        <td><input type="text" name="description" value={editedItem.description} onChange={handleInputChange} /></td>
                        <td><input type="number" name="price" value={editedItem.price} onChange={handleInputChange} /></td>
                        <td><input type="text" name="category" value={editedItem.category} onChange={handleInputChange} /></td>
                        <td><input type="number" name="SOH" value={editedItem.SOH} onChange={handleInputChange} /></td>
                        <td>
                            <button onClick={() => handleConfirm(null)}>Confirm</button>
                        </td>
                        <td>
                            <button onClick={handleCancel}>Cancel</button>
                        </td>
                    </tr>
                )}
                {menuItems.map(item => (
                    <tr key={item.id}>
                        {/* If editing, show textboxes. Otherwise, show text  */}
                        {editingItemId === item.id ? (
                            <>
                                <td><input type="text" name="item_name" value={editedItem.item_name} onChange={handleInputChange} /></td>
                                <td><input type="text" name="description" value={editedItem.description} onChange={handleInputChange} /></td>
                                <td><input type="number" name="price" value={editedItem.price} onChange={handleInputChange} /></td>
                                <td><input type="text" name="category" value={editedItem.category} onChange={handleInputChange} /></td>
                                <td><input type="number" name="SOH" value={editedItem.SOH} onChange={handleInputChange} /></td>
                                <td>
                                    <button onClick={() => handleConfirm(item.id)}>Confirm</button>
                                </td>
                                <td>
                                    <button onClick={handleCancel}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{item.item_name}</td>
                                <td>{item.description}</td>
                                <td>{parseFloat(item.price).toFixed(2)}</td>
                                <td>{item.category}</td>
                                <td>{item.SOH}</td>
                                <td>
                                    <button onClick={() => handleModify(item)}>Modify</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Inventory;
