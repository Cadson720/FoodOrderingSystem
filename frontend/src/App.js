import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Payment from './Payment';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <nav>
                        <Link to="/">Home</Link> | <Link to="/Payment">Payment</Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<div>Home Page Content</div>} />
                    <Route path="/Payment" element={<Payment />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
