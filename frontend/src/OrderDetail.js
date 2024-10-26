import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import OrderStatus from './OrderStatus';
import './order.css';

function OrderDetail() {
  const [orders, setOrders] = useState([]);
  const { orderId, method } = useParams();

  const fetchOrders = () => {
    axios.get(`http://localhost:3001/api/orderdetail/${orderId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }

  useEffect(() => {
    fetchOrders();
  }, [orderId]);

  const handleInputChange = (e, order) => {
    setOrders(orders.map(o => {
      if (o.order_id === order.order_id) {
        return { ...order, [e.target.name]: e.target.value };
      }
      return o;
    }));
  }

  const handleSubmit = () => {
    axios.put(`http://localhost:3001/api/orderdetail/${orderId}`, { orders })
      .then(response => {
        alert('Order updated successfully');
      })
      .catch(error => {
        console.error('Error updating orders:', error);
      });
  };

  return (
    <div className="inventory-container">
      <div className="order-header">
        <h1 className="order-title">Order #{orderId}</h1>
        <div className="header-actions">
          {method === 'edit' && (
            <button 
              onClick={handleSubmit}
              className="action-link view"
            >
              Save Changes
            </button>
          )}
          <a href="/orders" className="action-link cancel">Back to Orders</a>
        </div>
      </div>

      {orders.length > 0 && <OrderStatus status={orders[0].status} />}

      <div className="order-items">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Shipping Address</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.item_id}</td>
                <td>${order.price.toFixed(2)}</td>
                <td>{order.quantity}</td>
                <td>${order.subtotal.toFixed(2)}</td>
                {method === 'edit' ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="shipping_address"
                        value={order.shipping_address}
                        onChange={(e) => handleInputChange(e, order)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="instructions"
                        value={order.instructions}
                        onChange={(e) => handleInputChange(e, order)}
                        className="form-input"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{order.shipping_address}</td>
                    <td>{order.instructions}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-section">
          <span className="total-amount">
            Total: ${orders.reduce((acc, order) => acc + order.subtotal, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;