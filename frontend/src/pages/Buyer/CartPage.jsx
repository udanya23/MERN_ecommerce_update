import React, { useEffect, useState } from "react"
import API from "../../services/axiosInstance"
import { useNavigate } from "react-router-dom"

export default function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)

  async function fetchCart() {
    try {
      const res = await API.get("/cart")
      setCart(res.data)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchCart()
  }, [])

  async function updateQuantity(productId, quantity) {
    if (quantity < 1) return
    try {
      await API.put("/cart/update", {
        productId,
        quantity
      })
      fetchCart()
    } catch (err) {
      console.log(err)
    }
  }

  async function removeItem(productId) {
    try {
      await API.delete(`/cart/remove/${productId}`)
      fetchCart()
    } catch (err) {
      console.log(err)
    }
  }
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>Your cart is empty</h3>
      </div>
    )
  }

  const totalPrice = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity
  }, 0)

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Cart</h2>
      <div className="row">
        {/* Cart Items */}
        <div className="col-md-8">
          {cart.items.map((item) => {
            const product = item.product
            return (
              <div
                key={product._id}
                className="card mb-3 shadow-sm"
              >
                <div className="row g-0 align-items-center">
                  <div className="col-md-3 text-center p-2">
                    <img
                      src={`http://localhost:2000/api/products/image/${product.images[0]}`}
                      className="img-fluid rounded"
                      style={{ maxHeight: "120px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text mb-2">
                        Price: <strong>₹{product.price}</strong>
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(product._id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(product._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          className="btn btn-danger btn-sm ms-3"
                          onClick={() => removeItem(product._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4 className="mb-3">Order Summary</h4>
            <p className="d-flex justify-content-between">
              <span>Total Items</span>
              <strong>{cart.items.length}</strong>
            </p>
            <p className="d-flex justify-content-between">
              <span>Total Price</span>
              <strong>₹{totalPrice}</strong>
            </p>
            <hr />
            <button
              className="btn btn-warning w-100"
              onClick={() => navigate("/buyer/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}