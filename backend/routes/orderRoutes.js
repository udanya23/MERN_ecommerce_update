const express = require("express")
const router = express.Router()

const Order = require("../models/Order")
const Cart = require("../models/Cart")
const { protect, authorizeRole } = require("../middleware/authMiddleware")

/*
PLACE ORDER
*/

router.post(
"/checkout",
protect,
authorizeRole("buyer"),
async (req, res) => {

    try {

        const { shippingAddress } = req.body

        const cart = await Cart.findOne({ buyer: req.user._id })
            .populate("items.product")

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            })
        }

        let totalAmount = 0

        const orderItems = cart.items.map(item => {

            totalAmount += item.product.price * item.quantity

            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            }

        })

        const order = await Order.create({

            buyer: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress

        })

        // clear cart
        cart.items = []
        await cart.save()

        res.status(201).json({
            message: "Order placed successfully",
            order
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Error placing order"
        })

    }

})

/*
ORDER HISTORY
*/

router.get(
"/my-orders",
protect,
authorizeRole("buyer"),
async (req, res) => {

    try {

        const orders = await Order.find({
            buyer: req.user._id
        })
            .populate("items.product", "name price")
            .sort({ createdAt: -1 })

        res.json(orders)

    } catch (err) {

        res.status(500).json({
            message: "Error fetching orders"
        })

    }

})

module.exports = router