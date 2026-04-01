import { useEffect, useState } from "react"
import axios from "../../services/axiosInstance"

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        const res = await axios.get("/orders/my-orders")
        setOrders(res.data)
        console.log(res)
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">My Orders</h2>
            {orders.length === 0 && (
                <div className="alert alert-info text-center">
                    No orders found
                </div>
            )}
            {
                orders.map(order => (
                    <div key={order._id} className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <h5 className="card-title">
                                    Order ID: {order._id}
                                </h5>
                                <span className="badge bg-success">
                                    {order.status}
                                </span>
                            </div>
                            <p className="fw-bold">
                                Total: ₹{order.totalAmount}
                            </p>
                            <h6>Items:</h6>
                            <ul className="list-group">
                                {
                                    order.items.map(item => (
                                        <li
                                            key={item._id}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            {item.product.name}
                                            <span className="badge bg-primary rounded-pill">
                                                {item.quantity}
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}