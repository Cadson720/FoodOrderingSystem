import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');  // To store the search term

    // Fetch menu items when the component loads
    useEffect(() => {
        fetchMenuItems();
    }, []);

    // Get Menu Items from backend
    const fetchMenuItems = () => {
        axios.get('http://localhost:3001/api/menu')
            .then(response => {
                setMenuItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching menu items:', error);
            });
    };

    // Filter items based on search term
    const filteredItems = menuItems.filter(item =>
        item.item_name && item.item_name.toLowerCase().includes(searchTerm.toLowerCase())  // Check if item_name exists
    );

    // Group and display items by category
    const sortedItems = {
        Pizza: filteredItems.filter(item => item.category === 'Pizza'),
        Salad: filteredItems.filter(item => item.category === 'Salad'),
        Dessert: filteredItems.filter(item => item.category === 'Dessert'),
        Beverage: filteredItems.filter(item => item.category === 'Beverage')
    };

    return (
        <div className="menu-container">
            <h1>Sydney Burgers</h1>
            <input
                type="text"
                placeholder="Search for items"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <h2>Pizza</h2>
            {sortedItems.Pizza.length > 0 ? (
                <ul>
                    {sortedItems.Pizza.map(item => (
                        <li key={item.id}>
                            {item.item_name} - ${parseFloat(item.price).toFixed(2)} <br />
                            {item.description} (Stock: {item.SOH})
                        </li>
                    ))}
                </ul>
            ) : <p>No pizza available</p>}

            <h2>Salad</h2>
            {sortedItems.Salad.length > 0 ? (
                <ul>
                    {sortedItems.Salad.map(item => (
                        <li key={item.id}>
                            {item.item_name} - ${parseFloat(item.price).toFixed(2)} <br />
                            {item.description} (Stock: {item.SOH})
                        </li>
                    ))}
                </ul>
            ) : <p>No salad available</p>}

            <h2>Dessert</h2>
            {sortedItems.Dessert.length > 0 ? (
                <ul>
                    {sortedItems.Dessert.map(item => (
                        <li key={item.id}>
                            {item.item_name} - ${parseFloat(item.price).toFixed(2)} <br />
                            {item.description} (Stock: {item.SOH})
                        </li>
                    ))}
                </ul>
            ) : <p>No dessert available</p>}

            <h2>Beverage</h2>
            {sortedItems.Beverage.length > 0 ? (
                <ul>
                    {sortedItems.Beverage.map(item => (
                        <li key={item.id}>
                            {item.item_name} - ${parseFloat(item.price).toFixed(2)} <br />
                            {item.description} (Stock: {item.SOH})
                        </li>
                    ))}
                </ul>
            ) : <p>No beverage available</p>}
        </div>
    );
}

export default Menu;
