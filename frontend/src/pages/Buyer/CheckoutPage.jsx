// import { useState } from "react"
// import axios from "../../services/axiosInstance"
// import { useNavigate } from "react-router-dom"

// export default function CheckoutPage() {
//     const [address, setAddress] = useState("")
//     const navigate = useNavigate()

//     const handleCheckout = async () => {
//         try {
//             const res = await axios.post("/orders/checkout", {
//                 shippingAddress: address
//             })
//             alert("Order placed successfully")
//             navigate("/orders")
//         } catch (err) {
//             alert(err.response?.data?.message)
//         }
//     }

//     return (
//         <div className="container mt-5">
//             <div className="row justify-content-center">
//                 <div className="col-md-6">
//                     <div className="card shadow">
//                         <div className="card-body">
//                             <h2 className="card-title mb-4 text-center">
//                                 Checkout
//                             </h2>
//                             <div className="mb-3">
//                                 <label className="form-label">
//                                     Shipping Address
//                                 </label>
//                                 <textarea
//                                     className="form-control"
//                                     rows="4"
//                                     placeholder="Enter shipping address"
//                                     value={address}
//                                     onChange={(e) => setAddress(e.target.value)}
//                                 />
//                             </div>
//                             <button
//                                 className="btn btn-success w-100"
//                                 onClick={handleCheckout}
//                             >
//                                 Place Order
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
import { useState } from "react"
import axios from "../../services/axiosInstance"

export default function CheckoutPage() {
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      const cart = await axios.get("/cart")
      let user = JSON.parse(localStorage.getItem("user"))
      const res = await axios.post("/payment/create-checkout-session", {
        items: cart.data.items,
        address,
        email: user.email
      })
      window.location.href = res.data.url
    } catch (err) {
      alert(err.response?.data?.message)
    }
  }

  return (
    <div>
      <h2>Checkout</h2>
      <textarea
        placeholder="Enter shipping address"
        value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
    <br />

    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Redirecting..." : "Pay Now"}
    </button>
  </div>
)
}