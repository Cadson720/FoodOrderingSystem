import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import {addToCart} from "./cartActions";

function Cart({ cart, setCart }) {

    //const user_id = 2460;
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(false);
    const [carts, setCarts] = useState([]);

    // Calculate total cost of the cart
    const totalCartPrice = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);


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
    // useEffect(() => {
    //     const fetchCartItems = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:3001/api/cart`);
    //             setCartItems(response.data);
    //         } catch (error) {
    //             console.error('Error fetching cart items:', error);
    //         }
    //     };
    //
    //     fetchCartItems();
    // }, [user_id]);


    const handleSubmitOrder = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        axios.post('http://localhost:3001/api/orderlist', { cart })
            .then(response => {
                console.log('Order submitted successfully!', response.data);
                setCart([]);  // Clear cart after order is submitted
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

            {/*<table className="inventory-table">*/}
            {/*    <thead>*/}
            {/*    <tr>*/}
            {/*        <th>Item</th>*/}
            {/*        <th>Quantity</th>*/}
            {/*        <th>Cost ($)</th>*/}
            {/*        <th>Additional Info</th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    {*/}
            {/*        cartItems.map(cart_items => (*/}
            {/*            <tr key={cart_items.cart_item_id}>*/}
            {/*                <td>{cart_items.cart_id}</td>*/}
            {/*                <td>{cart_items.cart_item_id}</td>*/}
            {/*                <td>{cart_items.quantity}</td>*/}

            {/*            </tr>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*    </tbody>*/}
            {/*</table>*/}
            <h2>Total cost:</h2>

            <div>
                <h2>Shopping Cart</h2>

                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        <table>
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
                                    <td>{item.name}</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <h3>Total: ${totalCartPrice.toFixed(2)}</h3>

                        <button onClick={handleSubmitOrder}>Submit Order</button>
                    </div>
                )}
            </div>

        </div>


    );
}

export default Cart;