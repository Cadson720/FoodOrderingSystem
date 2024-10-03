import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Order() {

  const [search, setSearch] = useState({});
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get('http://localhost:3001/api/orderlist')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/api/order/${id}`)
      .then(response => {
        fetchOrders();
      })
      .catch(error => {
        console.error('Error deleting order:', error);
      });
  }

  const handleInputChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    axios.get('http://localhost:3001/api/orderlist')
      .then(response => {
        setOrders(response.data.filter(order => order.order_id == search.orderId || order.create_date == search.createDate));
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="inventory-container">
      <h2>Order Management</h2>
      <div>
        <label>Date:</label>
        <input type="date" name="createDate" placeholder='Date' value={search.date} onChange={handleInputChange}/>
        <label>Id:</label>
        <input type="text" name="orderId" placeholder='OrderId' value={search.orderId} onChange={handleInputChange}/>
        <button onClick={handleSearch}>Search</button>
      </div>
      <table className="inventory-table">
        <thead>
        <tr>
            <th>Order Id</th>
            <th>Menu Id</th>
            <th>Quantity</th>
            <th>createDate</th>
            <th>status</th>
            <th>View</th>
            <th>Modify</th>
            <th>Delete</th>
        </tr>
        </thead>
        <tbody>
          {
            orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.menu_id}</td>
                <td>{order.quantity}</td>
                <td>{order.createDate}</td>
                <td>{order.status}</td>
                <td>
                   <a href={`/orderdetail/${order.order_id}/view`}>View</a>
                </td>
                <td>
                  {order.status === 'pending' ? <a href={`/orderdetail/${order.order_id}/edit`}>Edit</a> : ''}
                </td>
                <td>{order.status === 'pending' ? <button onClick={() => handleDelete(order.order_id)}>Delete</button> : ''}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Order;
