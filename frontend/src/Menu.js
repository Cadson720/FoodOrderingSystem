import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import './styles/Menu.css';  // Link the CSS file

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();  // Initialize useNavigate

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
        item.item_name && item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group and display items by category
    const sortedItems = {
        Pizza: filteredItems.filter(item => item.category === 'Pizza'),
        Salad: filteredItems.filter(item => item.category === 'Salad'),
        Dessert: filteredItems.filter(item => item.category === 'Dessert'),
        Beverage: filteredItems.filter(item => item.category === 'Beverage')
    };

    // Function to handle when an item is clicked
    const handleItemClick = (itemId) => {
        navigate(`/menu/${itemId}`);  // Navigate to the item's detail page
    };

    // Add items to cart
    const addToCart = (menuItem) => {
        setCartItems((prevItems) => [...prevItems, menuItem]);  // prevItems = most recent cartItems state
    }

    // Remove items from cart
    const removeFromCart = (cartItemId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== cartItemId)
        );
    }

    return (
        <div className="menu-container">
            <h1>Sydney Burgers</h1>
            <input
                type="text"
                placeholder="Search for items"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="menu-search"
            />

            <h2 className="menu-category">Pizza</h2>
            {sortedItems.Pizza.length > 0 ? (
                <ul className="menu-items pizza-items">
                    {sortedItems.Pizza.map(item => (
                        item.SOH > 0 && (  // Only show items with stock greater than 0
                            <li key={item.id} className="menu-item">
                                <button onClick={() => handleItemClick(item.id)} className="menu-item-button">
                                    <span className="item-name">{item.item_name}</span> - 
                                    <span className="item-price">${parseFloat(item.price).toFixed(2)}</span>
                                </button>
                            </li>
                        )
                    ))}
                </ul>
            ) : <p>No pizza available</p>}

            <h2 className="menu-category">Salad</h2>
            {sortedItems.Salad.length > 0 ? (
                <ul className="menu-items salad-items">
                    {sortedItems.Salad.map(item => (
                        item.SOH > 0 && (  // Only show items with stock greater than 0
                            <li key={item.id} className="menu-item">
                                <button onClick={() => handleItemClick(item.id)} className="menu-item-button">
                                    <span className="item-name">{item.item_name}</span> - 
                                    <span className="item-price">${parseFloat(item.price).toFixed(2)}</span>
                                </button>
                            </li>
                        )
                    ))}
                </ul>
            ) : <p>No salad available</p>}

            <h2 className="menu-category">Dessert</h2>
            {sortedItems.Dessert.length > 0 ? (
                <ul className="menu-items dessert-items">
                    {sortedItems.Dessert.map(item => (
                        item.SOH > 0 && (  // Only show items with stock greater than 0
                            <li key={item.id} className="menu-item">
                                <button onClick={() => handleItemClick(item.id)} className="menu-item-button">
                                    <span className="item-name">{item.item_name}</span> - 
                                    <span className="item-price">${parseFloat(item.price).toFixed(2)}</span>
                                </button>
                            </li>
                        )
                    ))}
                </ul>
            ) : <p>No dessert available</p>}

            <h2 className="menu-category">Beverage</h2>
            {sortedItems.Beverage.length > 0 ? (
                <ul className="menu-items beverage-items">
                    {sortedItems.Beverage.map(item => (
                        item.SOH > 0 && (  // Only show items with stock greater than 0
                            <li key={item.id} className="menu-item">
                                <button onClick={() => handleItemClick(item.id)} className="menu-item-button">
                                    <span className="item-name">{item.item_name}</span> - 
                                    <span className="item-price">${parseFloat(item.price).toFixed(2)}</span>
                                </button>
                            </li>
                        )
                    ))}
                </ul>
            ) : <p>No beverage available</p>}
        </div>
    );
}

export default Menu;
