import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './order.css';

function Order() {
  const [search, setSearch] = useState({
    createDate: '',
    orderId: ''
  });
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOrders = () => {
    axios.get('http://localhost:3001/api/orderlist')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setErrorMessage('Failed to fetch orders. Please try again.');
      });
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      axios.delete(`http://localhost:3001/api/order/${id}`)
        .then(response => {
          fetchOrders();
        })
        .catch(error => {
          console.error('Error deleting order:', error);
          setErrorMessage('Failed to cancel order. Please try again.');
        });
    }
  }

  const handleInputChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setErrorMessage('');

    const orderId = search.orderId;
    if (orderId && !/^\d+$/.test(orderId)) {
      setErrorMessage('Error: Order ID must be a number');
      return;
    }

    axios.get('http://localhost:3001/api/orderlist')
      .then(response => {
        let filteredOrders = response.data;

        if (orderId) {
          filteredOrders = filteredOrders.filter(order => 
            order.order_id.toString() === orderId);
        }

        if (search.createDate) {
          const searchDate = new Date(search.createDate);
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.create_date);
            return orderDate.getFullYear() === searchDate.getFullYear() 
              && orderDate.getMonth() === searchDate.getMonth()
              && orderDate.getDate() === searchDate.getDate();
          });
        }

        setOrders(filteredOrders);

        if (filteredOrders.length === 0) {
          setErrorMessage('No orders found matching your criteria');
        }
      })
      .catch(error => {
        console.error('Error searching orders:', error);
        setErrorMessage('Failed to search orders. Please try again.');
      });
  };

  const handleReset = () => {
    setSearch({
      createDate: '',
      orderId: ''
    });
    fetchOrders();
    setErrorMessage('');
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatOrderId = (id) => {
    return `#${id.toString().padStart(6, '0')}`;
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    };
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  const renderStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge status-pending',
      confirmed: 'status-badge status-confirmed',
      preparing: 'status-badge status-preparing',
      ready: 'status-badge status-ready',
      delivered: 'status-badge status-delivered',
      cancelled: 'status-badge status-cancelled'
    };

    return (
      <span className={statusClasses[status.toLowerCase()] || 'status-badge status-default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const ActionButtons = ({ order }) => (
    <div className="action-buttons">
      <a 
        href={`/orderdetail/${order.order_id}/view`}
        className="action-link view"
      >
        View
      </a>
      {order.status === 'pending' && (
        <>
          <a 
            href={`/orderdetail/${order.order_id}/edit`}
            className="action-link edit"
          >
            Edit
          </a>
          <button 
            onClick={() => handleDelete(order.order_id)}
            className="action-link cancel"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="inventory-container">
      <h2>Order Management</h2>
      
      <div className="search-section">
        <div className="search-group">
          <label>Date:</label>
          <input 
            type="date" 
            name="createDate" 
            value={search.createDate} 
            onChange={handleInputChange}
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
            className="search-input"
          />
        </div>

        <div className="button-group">
          <button 
            onClick={handleSearch}
            className="action-link search"
          >
            Search
          </button>
          <button 
            onClick={handleReset}
            className="action-link reset"
          >
            Reset
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="error-message">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="error-icon"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          {errorMessage}
        </div>
      )}

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>USER ID</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>{formatOrderId(order.order_id)}</td>
                <td>{order.userid}</td>
                <td>{renderStatusBadge(order.status)}</td>
                <td>{formatDate(order.createDate)}</td>
                <td>
                  <ActionButtons order={order} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Order;