import React, { useState } from "react"
import axios from "../../services/axiosInstance"
import { useNavigate } from "react-router-dom"

export default function BuyerRegister() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSendOtp = async (e) => {
        e.preventDefault()
        if (!formData.email) {
            return alert("Enter email first")
        }
        try {
            setLoading(true)
            const res = await axios.post("/buyer/send-otp", {
                email: formData.email
            })
            if (res.data.message) {
                alert(res.data.message)
                setOtpSent(true)
            }
        } catch (err) {
            alert(err.response?.data?.message || "OTP sending failed")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post("/buyer/verify-otp", {
                email: formData.email,
                otp
            })
            if (res.data.message) {
                alert(res.data.message)
                setEmailVerified(true)
                setOtpSent(false)
            }
        } catch (err) {
            alert(err.response?.data?.message || "OTP verification failed")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post("/buyer/register", formData)
            if (res.data.message) {
                alert(res.data.message)
                navigate("/buyer/login")
            }
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow p-4">
                        <h3 className="text-center mb-4">Buyer Registration</h3>
                        <form>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3 d-flex gap-2">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter Email"
                                    onChange={handleChange}
                                />
                                <button
                                    className="btn btn-primary"
                                    disabled={loading}
                                    onClick={handleSendOtp}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </button>
                            </div>
                            {otpSent && (
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Enter OTP"
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-success w-100"
                                        disabled={loading}
                                        onClick={handleVerifyOtp}
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            )}
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
                                className="btn btn-dark w-100"
                                disabled={!emailVerified || loading}
                                onClick={handleRegister}
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}