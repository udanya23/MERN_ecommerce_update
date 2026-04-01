const express= require("express")
const app=express() 
const cors= require("cors")
const connectDB = require("./config/db.js")
const sellerRoutes= require("./routes/sellerRoutes.js")
const productRoutes= require("./routes/productRoutes.js")
const buyerRoutes = require("./routes/buyerAuthRoutes")
const authRoutes = require("./routes/authRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const paymentRoutes = require("./routes/paymentRoutes.js")

const cookieParser =require("cookie-parser")
require("dotenv").config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
connectDB(app)
app.use(cookieParser())
app.get("/",(req,res)=>{
    res.json({message:"Testing route"})
})

app.use("/api", authRoutes)
app.use("/api/seller",sellerRoutes)
app.use("/api/product",productRoutes)
app.use("/api/buyer", buyerRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use('/api/payment',paymentRoutes)

app.listen(process.env.PORT,()=>console.log("Server is running on port",process.env.PORT))