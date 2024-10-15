import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './order.css';

function OrderDetail() {

  const [orders, setOrders] = useState([]);

  const { orderId, method } = useParams();  // Get the item ID from the URL

  const fetchOrders = () => {
    axios.get(`http://localhost:3001/api/orderdetail/${orderId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }

  const handleInputChange = (e, order) => {
    setOrders(orders.map(o => {
      if (o.order_id === order.order_id) {
        return { ...order, [e.target.name]: e.target.value };
      }
      return o;
    }));
  }

  const handleSubmit = () => {
    axios.put(`http://localhost:3001/api/orderdetail/${orderId}`, {orders})
      .then(response => {
        console.log(response.data);
        alert('Order updated successfully');
      })
      .catch(error => {
        console.error('Error updating orders:', error);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="inventory-container">
      <h2>Order</h2>
      <table className="inventory-table">
        <thead>
        <tr>
            <th>Item id</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Shipping address</th>
            <th>Instructions</th>
        </tr>
        </thead>
        <tbody>
          {
            orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.item_id}</td>
                <td>{order.price}</td>
                <td>{order.quantity}</td>
                <td>{order.subtotal}</td>
                {
                  method === 'edit' ? (
                    <>
                      <td><input type="text" name="shipping_address" value={order.shipping_address} onChange={(e) => handleInputChange(e, order)} /></td>
                      <td><input type="text" name="instructions" value={order.instructions} onChange={(e) => handleInputChange(e, order)} /></td>
                    </>
                  ) : (
                    <>
                      <td>{order.shipping_address}</td>
                      <td>{order.instructions}</td>
                    </>
                  )
                }
              </tr>
            ))
          }
        </tbody>
      </table>
      <div style={{ display: "flex" }}>
        Total: {orders.reduce((acc, order) => acc + order.subtotal, 0)} &nbsp;
        {method === 'edit' && <button onClick={handleSubmit}>Submit</button>} &nbsp;
        <a href='/orders'>Back</a>
      </div>
    </div>
  )
}

export default OrderDetail;
