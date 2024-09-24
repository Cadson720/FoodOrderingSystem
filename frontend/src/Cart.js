import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(false);

    return(<div className="cart-container">
            <h1 className="cart-title">Shopping Cart</h1>
            <p>here be the cart</p>
        </div>

    );
}

export default Cart;