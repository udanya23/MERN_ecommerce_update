import React, { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from "../services/axiosInstance"

export default function Navigation() {

    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    async function handleLogout() {
        await API.post("/logout")
            .then(res => {
                logout()
                navigate("/login")
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">

                <Link className="navbar-brand" to="/">E-Commerce</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav me-auto">

                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}

                        {user?.role == 'seller' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/seller/dashboard">Dashboard</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/seller/add-product">Add Product</Link>
                                </li>
                            </>
                        )}

                        {user?.role == "buyer" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/buyer/dashboard">Dashboard</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/buyer/cart">Cart</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/buyer/order">Orders</Link>
                                </li>
                            </>
                        )}

                    </ul>

                    {user && (
                        <button
                            className="btn btn-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}

                </div>
            </div>
        </nav>
    )
}