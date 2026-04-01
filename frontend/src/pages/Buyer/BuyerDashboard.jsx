import React, { useEffect, useState } from "react"
import API from "../../services/axiosInstance"
import { Link } from "react-router-dom"

export default function BuyerDashboard() {

  const [orders, setOrders] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {

      const res = await API.get("/orders/my-orders")

      const ordersData = res.data

      setOrders(ordersData)

      // calculate stats
      let spent = 0
      let items = 0

      ordersData.forEach(order => {
        spent += order.totalAmount

        order.items.forEach(item => {
          items += item.quantity
        })
      })

      setTotalSpent(spent)
      setTotalItems(items)

    } catch (err) {
      console.log(err)
    }
  }

  return (

    <div className="container mt-5">

      <h2 className="text-center mb-4">Buyer Dashboard</h2>

      {/* Stats Section */}
      <div className="row mb-4">

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Total Orders</h5>
              <h3>{orders.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Total Items Purchased</h5>
              <h3>{totalItems}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Total Money Spent</h5>
              <h3>₹{totalSpent}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="row g-4 mb-5">

        <div className="col-md-4">
          <div className="card text-center shadow-sm h-100">
            <div className="card-body">
              <h5>Browse Products</h5>
              <p>Explore available products</p>
              <Link to="/" className="btn btn-primary">
                View Products
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm h-100">
            <div className="card-body">
              <h5>My Cart</h5>
              <p>Check items added to cart</p>
              <Link to="/buyer/cart" className="btn btn-warning">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm h-100">
            <div className="card-body">
              <h5>My Orders</h5>
              <p>Track your orders</p>
              <Link to="/buyer/order" className="btn btn-success">
                View Orders
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders */}
      <div>

        <h4 className="mb-3">Recent Orders</h4>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (

          <table className="table table-bordered">

            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              {orders.slice(0, 5).map(order => (

                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.status}</td>
                  <td>₹{order.totalAmount}</td>
                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  )
}