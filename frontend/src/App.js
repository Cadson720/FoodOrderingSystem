import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Payment from './Payment';
import Inventory from './Inventory';  // 导入新创建的Inventory组件

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <nav>
                        <Link to="/">Home</Link> | <Link to="/Payment">Payment</Link> | <Link to="/Inventory">Inventory</Link> {/* 新增Inventory链接 */}
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Payment" element={<Payment />} />
                    <Route path="/Inventory" element={<Inventory />} /> {/* 新增Inventory路由 */}
                </Routes>
            </div>
        </Router>
    );
}

// Home组件，仅包含首页内容
function Home() {
    return (
        <div>
            <h1>Home Page Content</h1>
        </div>
    );
}

export default App;
