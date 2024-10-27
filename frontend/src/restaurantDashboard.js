import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/restaurantDashboard.css'; // Updated stylesheet import

function RestaurantDashboard() {
  const [search, setSearch] = useState({
    createDate: '',
    orderId: ''
  });
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOrders = () => {
    axios.get('http://localhost:3001/api/orders') // Fetches from new orders endpoint
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setErrorMessage('Failed to fetch orders');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      axios.delete(`http://localhost:3001/api/order/${id}`)
        .then(response => {
          fetchOrders(); // Refresh the list after deletion
          setErrorMessage(''); // Clear any existing error messages
        })
        .catch(error => {
          console.error('Error canceling order:', error);
          setErrorMessage('Failed to cancel order');
        });
    }
  };

  const handleInputChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setErrorMessage('');
    
    axios.get('http://localhost:3001/api/orders')
      .then(response => {
        let filteredOrders = response.data;

        if (search.orderId) {
          const searchOrderId = search.orderId.replace(/\D/g, '');
          filteredOrders = filteredOrders.filter(order => 
            order.order_id === parseInt(searchOrderId)
          );
        }

        if (search.createDate) {
          const searchDate = new Date(search.createDate);
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.createDate);
            return (
              orderDate.getFullYear() === searchDate.getFullYear() &&
              orderDate.getMonth() === searchDate.getMonth() &&
              orderDate.getDate() === searchDate.getDate()
            );
          });
        }

        setOrders(filteredOrders);

        if (filteredOrders.length === 0) {
          setErrorMessage('No orders found matching your criteria');
        }
      })
      .catch(error => {
        console.error('Error searching orders:', error);
        setErrorMessage('Error searching orders');
      });
  };

  const handleReset = () => {
    setSearch({ createDate: '', orderId: '' });
    fetchOrders();
    setErrorMessage('');
  };

  const formatOrderId = (id) => `#${id.toString().padStart(6, '0')}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="inventory-container">
      <h2>Restaurant Dashboard</h2>
      
      <div className="search-section">
        <div className="search-group">
          <label>Date:</label>
          <input 
            type="date" 
            name="createDate" 
            value={search.createDate} 
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
        </div>

        <div className="search-group">
          <label>Order ID:</label>
          <input 
            type="text" 
            name="orderId" 
            placeholder="Enter order number"
            value={search.orderId} 
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
        </div>

        <div className="button-group">
          <button 
            onClick={handleSearch}
            className="search-button"
          >
            Search
          </button>
          <button 
            onClick={handleReset}
            className="reset-button"
          >
            Reset
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="error-message">
          <span>⚠</span>
          {errorMessage}
        </div>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>USER NAME</th>
            <th>ITEM</th>
            <th>QUANTITY</th>
            <th>STATUS</th>
            <th>DATE</th>
            <th>INSTRUCTIONS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-orders">No orders found</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.order_id}>
                <td>{formatOrderId(order.order_id)}</td>
                <td>{order.user_name}</td>
                <td>{order.item_name}</td>
                <td>{order.quantity}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{formatDate(order.createDate)}</td>
                <td>{order.instructions}</td>
                <td>
                  <div className="action-buttons">
                    <Link 
                      to={`/restaurantOrderDetail/${order.order_id}`}
                      className="action-link view"
                    >
                      View
                    </Link>
                    {order.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleDelete(order.order_id)}
                          className="action-link cancel"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RestaurantDashboard;
