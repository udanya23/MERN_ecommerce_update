import React, { useState } from 'react'
import axios from '../../services/axiosInstance.jsx'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const navigate= useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [otp, setOtp] = useState(null)
    const [otpSent, setOtpSent] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    function handleSendOtp(e) {
        e.preventDefault()
        try{
            axios.post("/seller/send-otp", { email: formData.email })
            .then(res=>{
                if(res.data.message){
                     setOtpSent(true)
                     setLoading(true)
                }
                   
            })
        }
        catch(err){
            console.log(err.response)
        }
    }
    function handleVerifyOtp(e) {
        e.preventDefault()
        try{
            axios.post("/seller/verify-otp",{email:formData.email,otp})
                .then(res=>{
                    if(res.data.message){
                        alert(res.data.message)
                        setEmailVerified(true)
                        setOtpSent(false)
                    }
                })
        }
        catch(err){
            alert(err.response.message)
            setLoading(false)
        }
    }
    function handleRegister(e) {
        e.preventDefault()
        try{
            axios.post("/seller/register",formData)
                .then(res=>{
                    if(res.data.message){
                         alert(res.data.message)
                         navigate("/login")
                    }
                })
        }
        catch(err){
            alert(err.response.message)
        }
    }
    return (
        <div>
            <form>
                <input
                    type="text"
                    name="name"
                    placeholder='Enter name'
                    onChange={handleChange} /> <br />
                <input
                    type="text"
                    name="email"
                    placeholder='Enter Email'
                    onChange={handleChange} />
                <button disabled={loading} onClick={handleSendOtp}>Send OTP</button> <br />
                {
                    otpSent &&
                    <div>
                        <input
                            type="text"
                            placeholder='Enter OTP to verify Email'
                            onChange={(e) => setOtp(e.target.value)} />
                        <button onClick={handleVerifyOtp}>Verify OTP</button> <br />
                    </div>
                }
                <input
                    type="password"
                    name="password"
                    placeholder='Enter Password'
                    onChange={handleChange} /> <br />
                <button disabled={!emailVerified} onClick={handleRegister}>Register</button>
            </form>
        </div>
    )
}