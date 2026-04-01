const mongoose = require("mongoose")
const ProductSchema= mongoose.Schema({
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    name:String,
    description:String,
    price:Number,
    category:String,
    stock:Number,
    images:[
        {
            type:mongoose.Schema.Types.ObjectId,
        }
    ]
},{timestamps:true})
module.exports=mongoose.model("Product",ProductSchema)