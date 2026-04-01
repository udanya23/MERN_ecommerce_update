import { useEffect, useState } from "react"
import axiosInstance from "../../services/axiosInstance"

const SellerDashboard = () => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {

        try {

            const res = await axiosInstance.get("/product/my-products")
            setProducts(res.data)

        } catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <h4 className="text-center mt-5">Loading...</h4>

    return (
        <div className="container mt-4">

            <h3 className="mb-4">My Products</h3>

            <div className="row">

                {products.map((product) => (

                    <div className="col-md-4 mb-4" key={product._id}>

                        <div className="card">

                            <div className="card-body">

                                <h5>{product.name}</h5>

                                <p>{product.description}</p>

                                <p><b>₹{product.price}</b></p>

                                <div className="d-flex flex-wrap">

                                    {product.images.map((imgId, index) => (

                                        <img
                                            key={index}
                                            src={`http://localhost:5000/api/product/image/${imgId}`}
                                            width="80"
                                            height="80"
                                            className="me-2 mb-2"
                                            style={{ objectFit: "cover" }}
                                            alt="product"
                                        />

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    )
}

export default SellerDashboard