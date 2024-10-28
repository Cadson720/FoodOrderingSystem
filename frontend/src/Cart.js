import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './App.css';

function Cart({ cart, setCart }) {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    // Calculate total cost of the cart
    const totalCartPrice = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);

    const handleSubmitOrder = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
    
        const orderData = {
            cart,
            userId: 2460,  // default  id
            shippingAddress: "Guangzhou", // default address
            instructions: "Please write insructions"
        };
    
        // Submit the cart items as an order to the backend
        axios.post('http://localhost:3001/api/submit-order', orderData)
            .then(response => {
                console.log('Order submitted successfully!', response.data);
                setCart([]);  // Clear the cart after order submission
                alert('Order has been submitted. Please enter your payment detail at the next page.');
                navigate('/payment');
            })
            .catch(error => {
                console.error('Error submitting the order:', error);
            });
    };

    return(
        <div className="inventory-container">
            <h1 className="cart-title">Shopping Cart</h1>

            <h2>Total cost:</h2>

            <div>
                <h2>Shopping Cart</h2>

                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        <table className="inventory-table">
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.item_name}</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <h3>Total: ${totalCartPrice.toFixed(2)}</h3>

                        <button onClick={handleSubmitOrder}>Submit Order & Pay</button>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Cart;
