import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import SignIn from './SignIn'; // Import the SignIn component
import Payment from './Payment';
import Inventory from './Inventory';
import Menu from './Menu';
import MenuItemDetail from './MenuItemDetail'; // Import the detail page for menu items
import Cart from './Cart';

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

                    {/* Protect the home page and other components */}
                    <Route path="/*" element={isSignedIn ? <Home setIsSignedIn={setIsSignedIn} /> : <Navigate to="/signin" />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home({ setIsSignedIn }) {
    return (
        <div>
            {/* Navigation bar */}
            <header className="App-header">
                <nav className="navbar">
                    <div className="center-links">
                        <Link to="/" className="nav-link">Home</Link> |
                        <Link to="/Menu" className="nav-link">Menu</Link> |
                        <Link to="/Payment" className="nav-link">Payment</Link> |
                        <Link to="/Inventory" className="nav-link">Inventory</Link>
                    </div>
                    <Link to="/Cart" className="nav-link cart-link">Cart</Link>
                    <SignOutButton setIsSignedIn={setIsSignedIn} />
                </nav>
            </header>

            {/* Nested Routes within Home */}
            <Routes>
                <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
                <Route path="/Payment" element={<Payment />} />
                <Route path="/Inventory" element={<Inventory />} />
                <Route path="/Menu" element={<Menu />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/menu/:itemId" element={<MenuItemDetail />} />
            </Routes>
        </div>
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
