import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Payment from './Payment';
import Inventory from './Inventory';
import Menu from './Menu';
import MenuItemDetail from './MenuItemDetail'; // Import the detail page for menu items
import Cart from './Cart';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <nav className="navbar">
                        <div className="center-links">
                            <Link to="/" className="nav-link">Home</Link> |
                            <Link to="/Menu" className="nav-link">Menu</Link> |
                            <Link to="/Payment" className="nav-link">Payment</Link> |
                            <Link to="/Inventory" className="nav-link">Inventory</Link> |
                        </div>
                        <Link to="/Cart" className="nav-link cart-link">Cart</Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Payment" element={<Payment />} />
                    <Route path="/Inventory" element={<Inventory />} />
                    <Route path="/Menu" element={<Menu />} />
                    <Route path="/Inventory" element={<Cart />} />
                    {/* New Route for individual Menu Item details */}
                    <Route path="/menu/:itemId" element={<MenuItemDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div>
            <h1>Home Page Content</h1>
        </div>
    );
}

export default App;
