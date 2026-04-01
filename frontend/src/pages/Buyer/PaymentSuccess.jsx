import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function PaymentSuccess() {
  const navigate = useNavigate()
  useEffect(() => {
    alert("Payment Successful!")
    navigate("/buyer/order")
  }, [])
  return <h2>Payment Successful</h2>
}