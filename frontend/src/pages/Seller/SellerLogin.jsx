import React, { useState, useContext } from "react"
import axios from "../../services/axiosInstance"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function SellerLogin() {

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

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

      const res = await axios.post("/seller/login", formData)

      alert("Seller Login Successful")

      login(res.data) // should contain { token, user }
      console.log(res.data)
      navigate("/seller/dashboard")

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
        /><br /><br />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}