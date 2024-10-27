// frontend/OrderDetailView.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/restaurantOrderDetail.css';

function RestaurantOrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Fetch the order and user details by orderId
        axios.get(`http://localhost:3001/api/orderdetailwithuser/${orderId}`)
            .then(response => {
                setOrder(response.data);
                setStatus(response.data.status);
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
                setErrorMessage('Failed to load order details');
            });
    }, [orderId]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleStatusUpdate = () => {
        axios.put(`http://localhost:3001/api/order/update-status/${orderId}`, { status })
            .then(response => {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
            })
            .catch(error => {
                console.error('Error updating status:', error);
                setErrorMessage('Failed to update order status');
            });
    };

    return (
        <div className="order-detail-container">
            <h2>Order Detail - {orderId}</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {order && (
                <div className="order-detail-content">
                    {/* User Information */}
                    <h3>User Information</h3>
                    <p><strong>Username:</strong> {order.user_name}</p>
                    <p><strong>Email:</strong> {order.user_email}</p>
                    <p><strong>Phone Number:</strong> {order.user_phone}</p>

                    {/* Order Information in two-column layout */}
                    <h3>Order Information</h3>
                    <div className="order-info-grid">
                        <p><strong>Item Price:</strong> ${order.price.toFixed(2)}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
                        <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                        <p><strong>Instructions:</strong> {order.instructions}</p>
                        <p><strong>Current Status:</strong> {order.status}</p>
                        <p><strong>Order Date:</strong> {new Date(order.createDate).toLocaleString()}</p>
                    </div>

                    {/* Status Update Section */}
                    <div className="status-update-section">
                        <label htmlFor="status">Update Status:</label>
                        <select id="status" value={status} onChange={handleStatusChange}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button onClick={handleStatusUpdate} className="update-button">
                            Update Status
                        </button>
                    </div>

                    <button onClick={() => navigate('/restaurant-dashboard')} className="back-button">
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}

export default RestaurantOrderDetail;
