import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'; // Add useNavigate here
import './App.css';
import SignIn from './SignIn';
import Payment from './Payment';
import Inventory from './Inventory';
import Menu from './Menu';
import MenuItemDetail from './MenuItemDetail';
import Cart from './Cart';

function App() {
    const [isSignedIn, setIsSignedIn] = useState(false);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/signin" element={<SignIn setIsSignedIn={setIsSignedIn} />} />
                    <Route path="/*" element={isSignedIn ? <Home setIsSignedIn={setIsSignedIn} /> : <Navigate to="/signin" />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home({ setIsSignedIn }) {
    return (
        <div>
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
    const navigate = useNavigate(); // Now useNavigate is defined

    const handleSignOut = () => {
        setIsSignedIn(false);
        navigate('/signin');
    };

    return (
        <button className="signout-button" onClick={handleSignOut}>
            Sign Out
        </button>
    );
}

export default App;