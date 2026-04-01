import React, { useEffect, useState, useContext } from "react"
import API from "../services/axiosInstance"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Home() {

  const [products, setProducts] = useState([])
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await API.get("/product/all-products")
      setProducts(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddToCart = async (productId) => {

    if (!user) {
      alert("Please login first")
      navigate("/login")
      return
    }

    if (user.role !== "buyer") {
      alert("Only buyers can add to cart")
      return
    }

    try {

      await API.post("/cart/add", {
        productId,
        quantity: 1
      })

      alert("Product added to cart")

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4 text-center">All Products</h2>

      <div className="row">

        {products.map((p) => (

          <div key={p._id} className="col-md-3 mb-4">

            <div className="card h-100 shadow-sm">

              {p.images?.length > 0 && (
                <img
                  src={`http://localhost:2000/api/products/image/${p.images[0]}`}
                  className="card-img-top"
                  alt={p.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}

              <div className="card-body d-flex flex-column">

                <h5 className="card-title">{p.name}</h5>

                <p className="card-text">{p.description}</p>

                <p className="fw-bold text-success">₹{p.price}</p>

                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleAddToCart(p._id)}
                >
                  Add To Cart
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}