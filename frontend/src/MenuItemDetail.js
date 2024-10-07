import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate for back navigation
import './styles/MenuItemDetail.css'; // Link the new CSS file

function MenuItemDetail() {
    const { itemId } = useParams();  // Get the item ID from the URL
    const [item, setItem] = useState(null);
    const navigate = useNavigate(); // For back navigation

    useEffect(() => {
        // Fetch the specific menu item by its ID
        axios.get(`http://localhost:3001/api/menu/${itemId}`)
            .then(response => {
                console.log(response.data);  // Check if data is being received correctly
                setItem(response.data);
            })
            .catch(error => {
                console.error('Error fetching item:', error);
            });
    }, [itemId]);

    if (!item) {
        return <p>Loading...</p>;
    }

    // Ensure that item is valid and does not contain unexpected data
    if (!["Pizza", "Salad", "Dessert", "Beverage"].includes(item.category)) {
        return <p>Item not found or invalid category.</p>;
    }

    return (
        <div className="menu-item-detail-container">
            <div className="menu-item-detail-card">
                <div className="item-image-wrapper">
                    {/* Use burger-bg.png as the static image for all menu items */}
                    <img 
                        src="/burger-bg.png" 
                        alt="Menu item" 
                        className="item-image"
                    />
                </div>
                <div className="item-details">
                    <h1 className="item-name">{item.item_name}</h1>
                    <p className="item-description"><strong>Description:</strong> {item.description}</p>
                    <p className="item-price"><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
                    <p className="item-category"><strong>Category:</strong> {item.category}</p>
                    <p className="item-stock">
                        <strong>Stock Available:</strong> {item.SOH > 0 ? (
                            <span className="in-stock">Available</span>
                        ) : (
                            <span className="out-of-stock">Out of stock</span>
                        )}
                    </p>
                    <button className="back-button" onClick={() => navigate(-1)}>Back to Menu</button>
                </div>
            </div>
        </div>
    );
}

export default MenuItemDetail;
