import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Menu.css';
//import { addToCart } from './cartActions';


function Menu({ cart, setCart }) {
    //const user_id = 2460;
    const [menuItems, setMenuItems] = useState([]);
    //const [cart, setCart] = useState([]);

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

    // Group and display items by category dynamically
    const categorizedItems = filteredItems.reduce((acc, item) => {
        if (item.SOH > 0) {  // Only show items with stock greater than 0
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
        }
        return acc;
    }, {});

    // Function to handle when an item is clicked
    const handleItemClick = (itemId) => {
        navigate(`/menu/${itemId}`);  // Navigate to the item's detail page
    };


    // Function to add menu items to cart
    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            // Update quantity if item already exists in the cart
            setCart(cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            // Add new item to the cart with quantity 1
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };


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

            {/* Loop through the categories dynamically */}
            {Object.keys(categorizedItems).length > 0 ? (
                Object.keys(categorizedItems).map((category) => (
                    <div key={category}>
                        <h2 className="menu-category">{category}</h2>
                        <ul className={`menu-items ${category.toLowerCase()}-items`}>
                            {categorizedItems[category].map(item => (
                                <li key={item.id} className="menu-item">
                                    <button onClick={() => handleItemClick(item.id)} className="menu-item-button">
                                        <img
                                            src={`/images/${item.item_name.toLowerCase().replace(/\s/g, '-')}.jpg`}
                                            alt={item.item_name}
                                            className="item-image"
                                        />
                                        <span className="item-name">{item.item_name}</span>
                                        <span className="item-price">${parseFloat(item.price).toFixed(2)}</span>
                                    </button>
                                    <button onClick={() => addToCart(item)}>+</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : <p>No items available</p>}
        </div>
    );
}

export default Menu;
