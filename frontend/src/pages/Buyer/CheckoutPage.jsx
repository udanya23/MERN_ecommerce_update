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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-5 bg-glass text-center">
            <h2 className="mb-4 section-title">Checkout</h2>
            <p className="text-muted mb-4">Please provide your shipping address to proceed with the payment.</p>
            <div className="mb-4">
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter shipping address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            
            <button 
              className="btn btn-success btn-lg w-100 shadow-sm" 
              onClick={handleCheckout} 
              disabled={loading || !address.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Redirecting to Stripe...
                </>
              ) : "Pay Now & Confirm Order"}
            </button>
            <p className="mt-3 small text-muted">
              Secure payment via Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
)
}