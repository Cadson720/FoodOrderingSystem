import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import {addToCart} from "./cartActions";

const Cart = () => {

    const user_id = 2460;
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(false);
    const [carts, setCarts] = useState([]);

    const fetchCarts = () => {
        axios.get('http://localhost:3001/api/cart')
            .then(response => {
                setCarts(response.data);
            })
            .catch(error => {
                console.error('Error fetching cart(s):', error);
            });
    }

    // Fetch cart items from the backend on component mount
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/cart`);
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [user_id]);


    const handleSubmitOrder = () => {
        axios.post('http://localhost:3001/api/orderlist', { carts })
            .then(response => {
                console.log('Order submitted successfully!', response.data);
            })
            .catch(error => {
                console.error('There was an error submitting the order!', error);
            });
    };

    const handleAddToCart = (item) => {
        const updatedCart = addToCart(cartItems, item);
        setCartItems(updatedCart);
    };

    useEffect(() => {
        fetchCarts();
    }, []);

    return(
        <div className="inventory-container">
            <h1 className="cart-title">Shopping Cart</h1>
            <p>here be the cart</p>

            <table className="inventory-table">
                <thead>
                <tr>
                    <th>Cart Id</th>
                    <th>User Id</th>
                    <td>Date</td>

                </tr>
                </thead>
                <tbody>
                {
                    carts.map(cart => (
                        <tr key={cart.cart_id}>
                            <td>{cart.cart_id}</td>
                            <td>{cart.user_id}</td>
                            <td>{cart.created_at}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

            <table className="inventory-table">
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Cost ($)</th>
                    <th>Additional Info</th>
                </tr>
                </thead>
                <tbody>
                {
                    cartItems.map(cart_items => (
                        <tr key={cart_items.cart_item_id}>
                            <td>{cart_items.cart_id}</td>
                            <td>{cart_items.cart_item_id}</td>
                            <td>{cart_items.quantity}</td>

                        </tr>
                    ))
                }
                </tbody>
            </table>
            <h2>Total cost:</h2>
        </div>

    );
}

export default Cart;