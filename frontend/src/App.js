
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Payment from './Payment';
import Inventory from './Inventory';
import Menu from './Menu';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <nav>
                        <Link to="/">Home</Link> | <Link to="/Menu">Menu</Link> | <Link to="/Payment">Payment</Link> | <Link to="/Inventory">Inventory</Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Payment" element={<Payment />} />
                    <Route path="/Inventory" element={<Inventory />} />
                    <Route path="/Menu" element={<Menu />} />
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
