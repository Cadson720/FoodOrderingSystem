// frontend/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import SignIn from './SignIn'; // Import the SignIn component
import Payment from './Payment';
import Inventory from './Inventory';
import Menu from './Menu';
import MenuItemDetail from './MenuItemDetail'; // Import the detail page for menu items
import Cart from './Cart';
import Order from './Order';
import OrderDetail from './OrderDetail';
import RestaurantDashboard from './restaurantDashboard'; // Ensure the file path is correct
import RestaurantOrderDetail from './restaurantOrderDetail'; // Corrected import name to match component usage

function App() {
    // Initialize sign-in state from localStorage
    const [isSignedIn, setIsSignedIn] = useState(() => {
        return localStorage.getItem('isSignedIn') === 'true'; // Retrieve and parse sign-in status
    });

    // Update localStorage whenever sign-in state changes
    useEffect(() => {
        localStorage.setItem('isSignedIn', isSignedIn);
    }, [isSignedIn]);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Route to SignIn page */}
                    <Route path="/signin" element={<SignIn setIsSignedIn={setIsSignedIn} />} />

                    {/* Restaurant-specific routes with custom header */}
                    <Route path="/restaurant-dashboard" element={<WithRestaurantHeader><RestaurantDashboard /></WithRestaurantHeader>} />
                    <Route path="/restaurantOrderDetail/:orderId" element={<WithRestaurantHeader><RestaurantOrderDetail /></WithRestaurantHeader>} />
                    <Route path="/restaurant-inventory" element={<WithRestaurantHeader><Inventory /></WithRestaurantHeader>} />

                    {/* Default route for other pages */}
                    <Route path="/*" element={<Home setIsSignedIn={setIsSignedIn} />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home({ setIsSignedIn }) {
    const [cart, setCart] = useState([]); // cart is an array that holds the items added to the cart
    console.log("Cart is:", cart);

    return (
        <div>
            {/* Navigation bar */}
            <header className="App-header">
                <nav className="navbar">
                    <div className="center-links">
                        <Link to="/" className="nav-link">Home</Link> |
                        <Link to="/Menu" className="nav-link">Menu</Link> |
                        <Link to="/Payment" className="nav-link">Payment</Link> |
                        <Link to="/Orders" className="nav-link">Order</Link>
                    </div>
                    <Link to="/Cart" className="nav-link cart-link">Cart</Link>
                    <SignOutButton setIsSignedIn={setIsSignedIn} />
                </nav>
            </header>

            {/* Nested Routes within Home */}
            <Routes>
                <Route path="/" element={<Navigate to="/Menu" />} /> {/* Redirect Home to Menu */}
                <Route path="/Payment" element={<Payment />} />
                <Route path="/Orders" element={<Order />} />
                <Route path="/OrderDetail/:orderId/:method" element={<OrderDetail />} />
                <Route path="/menu/:itemId" element={<MenuItemDetail />} />

                {/* Pass the cart and setCart to both Menu and Cart components */}
                <Route path="/Menu" element={<Menu cart={cart} setCart={setCart} />} />
                <Route path="/Cart" element={<Cart cart={cart} setCart={setCart} />} />
            </Routes>
        </div>
    );
}

function RestaurantHeader({ setIsSignedIn }) {
    const navigate = useNavigate();

    const handleSignOut = () => {
        setIsSignedIn(false);
        localStorage.removeItem('isSignedIn'); // Clear sign-in state from localStorage
        navigate('/signin'); // Redirect to sign-in page after signing out
    };

    return (
        <header className="App-header">
            <nav className="navbar">
                <Link to="/restaurant-dashboard" className="nav-link">Orders</Link> |
                <Link to="/restaurant-inventory" className="nav-link">Inventory</Link>
                <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
            </nav>
        </header>
    );
}

// Higher-order component to include the RestaurantHeader
function WithRestaurantHeader({ children }) {
    const [isSignedIn, setIsSignedIn] = useState(() => {
        return localStorage.getItem('isSignedIn') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('isSignedIn', isSignedIn);
    }, [isSignedIn]);

    return (
        <>
            <RestaurantHeader setIsSignedIn={setIsSignedIn} />
            {children}
        </>
    );
}

function SignOutButton({ setIsSignedIn }) {
    const navigate = useNavigate();

    const handleSignOut = () => {
        setIsSignedIn(false);
        localStorage.removeItem('isSignedIn'); // Clear sign-in state from localStorage
        navigate('/signin'); // Redirect to sign-in page after signing out
    };

    return (
        <button className="signout-button" onClick={handleSignOut}>
            Sign Out
        </button>
    );
}

export default App;
