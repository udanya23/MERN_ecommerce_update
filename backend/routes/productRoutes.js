const express = require("express")
const router = express.Router()
const { protect, authorizeRole } = require("../middleware/authMiddleware.js")
const mongoose = require("mongoose")
const Product = require("../models/Product.js")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
function uploadToGridFS(bucket, file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null)
        const uploadStream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype
        })
        uploadStream.end(file.buffer)
        uploadStream.on("finish", () => resolve(uploadStream.id))
        uploadStream.on("error", reject)
    })
}


router.post(
    "/add-product",
    protect,
    authorizeRole("seller"),
    upload.array("images", 5),
    async (req, res) => {
        try {
            const { name, description, price, category, stock } = req.body
            const bucket = req.app.locals.bucket
            const imageIds = []
            for (let file of req.files) {
                const id = await uploadToGridFS(bucket, file)
                if (id) imageIds.push(id)
            }
            const newProduct = await Product.create({
                seller: req.user._id,
                name,
                description,
                price,
                category,
                stock,
                images: imageIds
            })
            console.log("seller adding product --------",newProduct)
            res.status(201).json({
                message: "Product added successfully",
                product: newProduct
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: "Error while adding product"
            })
        }
    }
)
router.get(
    "/my-products",
    protect,
    authorizeRole("seller"),
    async (req, res) => {
        try {

            const products = await Product.find({
                seller: req.user._id
            })
            .populate("seller", "name email")
            .sort({ createdAt: -1 })

            res.status(200).json(products)

        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: "While getting the products"
            })
        }
    }
)
router.get("/image/:id", async (req, res) => {
    try {
        const bucket = req.app.locals.bucket
        const fileId = new mongoose.Types.ObjectId(req.params.id)
        const downloadStream = bucket.openDownloadStream(fileId)
        downloadStream.on("data", (chunk) => {
            res.write(chunk)
        })
        downloadStream.on("error", () => {
            return res.status(404).json({
                message: "Image not found"
            })
        })
        downloadStream.on("end", () => {
            res.end()
        })
    } catch (err) {
        res.status(500).json({
            message: "Error fetching image"
        })
    }
})

router.get("/all-products", async (req, res) => {
    try {

        const products = await Product.find()
            .populate("seller", "name email")
            .sort({ createdAt: -1 })

        res.status(200).json(products)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error fetching products"
        })
    }
})

module.exports = router