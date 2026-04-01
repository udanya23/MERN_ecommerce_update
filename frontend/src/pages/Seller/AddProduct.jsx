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
    <div>
      <form onSubmit={handleAddProduct}>
        <div>
            <input 
                type="text" 
                placeholder='Enter product name' 
                name='name' 
                value={product.name}
                onChange={handleChange} />
        </div>
        <div>
            <input 
                type="text" 
                placeholder='Enter product description' 
                name='description' 
                value={product.description}
                onChange={handleChange} />
        </div>
        <div>
            <input 
                type="text" 
                placeholder='Enter product category' 
                name='category' 
                value={product.category}
                onChange={handleChange} />
        </div>
        <div>
            <input 
                type="number" 
                placeholder='Enter product price' 
                name='price' 
                value={product.price}
                onChange={handleChange} />
        </div>
         <div>
            <input 
                type="number" 
                placeholder='Enter product stock' 
                name='stock' 
                value={product.stock}
                onChange={handleChange} />
        </div>
        <div>
            <input 
                type="file"
                multiple
                onChange={handleImageChange} 
                accept='image/*' />
        </div>
        <button>
            {loading?"Uploading...":"Add product"}
        </button>
      </form>
    </div>
  )
}
