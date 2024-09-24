import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MenuItemDetail() {
    const { itemId } = useParams();  // Get the item ID from the URL
    const [item, setItem] = useState(null);

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
        <div className="menu-item-detail">
            <h1>{item.item_name}</h1>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Stock Available:</strong> {item.SOH}</p>
            {item.SOH > 0 ? (
                <p>This item is available for purchase.</p>
            ) : (
                <p>Out of stock.</p>
            )}
        </div>
    );
}

export default MenuItemDetail;
