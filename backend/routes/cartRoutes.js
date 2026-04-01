const express = require("express")
const router = express.Router()
const Cart = require("../models/Cart")
const { protect, authorizeRole } = require("../middleware/authMiddleware")



/*
ADD PRODUCT TO CART
*/
router.post(
  "/add",
  protect,
  authorizeRole("buyer"),
  async (req, res) => {

    try {

      const { productId, quantity } = req.body

      let cart = await Cart.findOne({ buyer: req.user._id })

      // if cart not exist create one
      if (!cart) {

        cart = new Cart({
          buyer: req.user._id,
          items: []
        })

      }

      // check if product already exists
      const existingProduct = cart.items.find(
        item => item.product.toString() === productId
      )

      if (existingProduct) {

        existingProduct.quantity += quantity || 1

      } else {

        cart.items.push({
          product: productId,
          quantity: quantity || 1
        })

      }

      await cart.save()

      res.json({
        message: "Product added to cart",
        cart
      })

    } catch (err) {

      console.log(err)

      res.status(500).json({
        message: "Error adding to cart"
      })

    }
  }
)



/*
GET BUYER CART
*/
router.get(
  "/",
  protect,
  authorizeRole("buyer"),
  async (req, res) => {

    try {

      const cart = await Cart.findOne({
        buyer: req.user._id
      }).populate("items.product")

      res.json(cart)

    } catch (err) {

      res.status(500).json({
        message: "Error fetching cart"
      })

    }

  }
)



/*
UPDATE QUANTITY
*/
router.put(
  "/update",
  protect,
  authorizeRole("buyer"),
  async (req, res) => {

    try {

      const { productId, quantity } = req.body

      const cart = await Cart.findOne({ buyer: req.user._id })

      const item = cart.items.find(
        i => i.product.toString() === productId
      )

      if (item) {

        item.quantity = quantity

      }

      await cart.save()

      res.json({
        message: "Cart updated",
        cart
      })

    } catch (err) {

      res.status(500).json({
        message: "Error updating cart"
      })

    }

  }
)



/*
REMOVE PRODUCT
*/
router.delete(
  "/remove/:productId",
  protect,
  authorizeRole("buyer"),
  async (req, res) => {

    try {

      const cart = await Cart.findOne({
        buyer: req.user._id
      })

      cart.items = cart.items.filter(
        item => item.product.toString() !== req.params.productId
      )

      await cart.save()

      res.json({
        message: "Product removed",
        cart
      })

    } catch (err) {

      res.status(500).json({
        message: "Error removing product"
      })

    }

  }
)

module.exports = router