import React, { useState, useContext } from "react"
import axios from "../../services/axiosInstance"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

export default function BuyerLogin() {
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post("/buyer/login", formData)
            console.log(res)
            if (res.data.accessToken) {
                //localStorage.setItem("token", res.data.token)
                login(res.data)
                alert("Login Successful")
                navigate("/")
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow p-4">
                        <h3 className="text-center mb-4">Buyer Login</h3>
                        <form>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter Email"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter Password"
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                className="btn btn-primary w-100"
                                disabled={loading}
                                onClick={handleLogin}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}