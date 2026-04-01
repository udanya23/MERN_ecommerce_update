const express = require("express")
const router = express.Router()
const stripe = require ("../utils/stripe")

router.post("/create-checkout-session", async(req,res)=>{
    try{
        const {items, address, email} = req.body
        console.log(req.body)
        const line_items = items.map(item => ({
            price_data : {
                currency: "inr",
                product_data: {
                    name: item.product.name
                },
                unit_amount: item.product.price * 100
            },
            quantity: item.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            customer_email: email,
            billing_address_collection: "required",
            shipping_address_collection: {
                allowed_countries: ["IN"]
            },
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`
        })
        res.json({url: session.url})
    } catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
})
module.exports = router 