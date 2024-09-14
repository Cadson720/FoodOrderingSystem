import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// 在 App.js 中定义 Payment 组件
function Payment() {
    return (
        <div>
            <h1>Payment Page</h1>
            <p>This is the payment page for our food ordering system.</p>
        </div>
    );
}

// 定义 App 组件
function App() {
    return (
        <Router>
            {/* 导航部分外部 */}
            <header className="App-header">
                {/* 导航链接 */}
                <nav>
                    <Link to="/">Home</Link> | <Link to="/Payment">Payment</Link>
                </nav>
            </header>

            {/* 定义路由 */}
            <Routes>
                {/* 主页路由 */}
                <Route path="/" element={
                    <div className="App">
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <p>
                                Edit <code>src/App.js</code> and save to reload.
                            </p>
                            <p>
                                This is the first page for our food ordering system. hi
                                test
                                Bottom Text
                            </p>
                            <a
                                className="App-link"
                                href="https://reactjs.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn React
                            </a>
                        </header>
                    </div>
                } />
                {/* Payment 页面路由 */}
                <Route path="/Payment" element={<Payment />} />
            </Routes>
        </Router>
    );
}

export default App;
