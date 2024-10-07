import React, { useEffect, useState } from 'react'; 
import axios from 'axios';

function Order() {

  const [search, setSearch] = useState({});
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
    // Reset error message
    setErrorMessage('');

    // Validate if orderId is an integer
    if (search.orderId && isNaN(parseInt(search.orderId))) {
      setErrorMessage('Error: Your input type is not an integer');
      return;
    }

    axios.get('http://localhost:3001/api/orderlist')
      .then(response => {
        setOrders(response.data.filter(order => order.order_id == search.orderId || (
          new Date(order.create_date).getFullYear() == new Date(search.createDate).getFullYear() 
          && new Date(order.create_date).getMonth() == new Date(search.createDate).getMonth()
          && new Date(order.create_date).getDate() == new Date(search.createDate).getDate()
        )));
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  };

  const handleReset = () => {
    // Refresh the page
    window.location.reload();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="inventory-container">
      <h2>Order</h2>
      <div>
        <label>Date:</label>
        <input type="date" name="createDate" placeholder='Date' value={search.createDate} onChange={handleInputChange}/>
        <label>Id:</label>
        <input type="text" name="orderId" placeholder='OrderId' value={search.orderId} onChange={handleInputChange}/>
        <button onClick={handleSearch}>Search</button>
        {/* Add the reset button */}
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* Display error message if invalid input */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>User Id</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {
            orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.userid}</td>
                <td>{order.status}</td>
                <td>{order.createDate}</td>
                <td>
                   <a href={`/orderdetail/${order.order_id}/view`}>View</a>
                </td>
                <td>
                  {order.status === 'pending' ? <a href={`/orderdetail/${order.order_id}/edit`}>Edit</a> : ''}
                </td>
                <td>{order.status === 'pending' ? <button onClick={() => handleDelete(order.order_id)}>Cancel order</button> : ''}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Order;
