import {useState} from 'react'
import axios from '../../services/axiosInstance'

export default function AddProduct() {
    const [product,setProduct]=useState({
        name:"", description:"", price:"", category:"", stock:""
    })
    const [loading,setLoading]=useState(false)
    const [images,setImages]=useState([])
    function handleChange(e){
        setProduct((prev)=>({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }
    function handleImageChange(e){
        setImages(e.target.files)
    }
    function handleAddProduct(e){
        e.preventDefault()
        const formData=new FormData()
        formData.append("name",product.name)
        formData.append("description",product.description)
        formData.append("price",Number(product.price))
        formData.append("category",product.category)
        formData.append("stock",Number(product.stock))
        for(let i=0;i<images.length;i++)
            formData.append("images",images[i])
        try{
            setLoading(true)
            axios.post("/product/add-product", formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            .then((res)=>{
                alert(res.data.message)
                setProduct({
                    name:"", description:"", price:"", category:"", stock:""
                })
                setImages([])
                setLoading(false)
            })
        }
        catch(err){
            console.log("while adding product",err)
        }
    }
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-5 bg-glass">
            <h3 className="text-center mb-4 section-title">Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder='Enter product name' 
                  name='name' 
                  value={product.name}
                  onChange={handleChange} 
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  placeholder='Enter product description' 
                  name='description' 
                  rows="3"
                  value={product.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder='Category' 
                    name='category' 
                    value={product.category}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    placeholder='Price' 
                    name='price' 
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Stock Quantity</label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder='Enter product stock' 
                  name='stock' 
                  value={product.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Product Images</label>
                <input 
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleImageChange} 
                  accept='image/*'
                  required
                />
                <small className="text-muted">You can select multiple images.</small>
              </div>
              <button className="btn btn-primary w-100 py-2 shadow-sm" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading...
                  </>
                ) : "Add product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
