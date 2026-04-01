const express = require("express")
const jwt = require("jsonwebtoken")
const sellerSchema = require("../models/Seller")
const buyerSchema = require("../models/Buyer")

const router = express.Router()

router.post("/refresh-token", async (req, res) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken)
        return res.status(401).json({ message: "No refresh token" })

    try {

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH)

        // Check seller first
        let user = await sellerSchema.findById(decoded.id)

        // If not seller, check buyer
        if (!user) {
            user = await buyerSchema.findById(decoded.id)
        }

        if (!user || user.refreshToken !== refreshToken)
            return res.status(403).json({ message: "Invalid token" })

        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )

        return res.json({ accessToken: newAccessToken })

    } catch (err) {
        return res.status(403).json({ message: "Token expired" })
    }
})


// LOGOUT (universal)
router.post("/logout", async (req, res) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken)
        return res.json({ message: "Already logged out" })

    try {

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH)

        let user = await sellerSchema.findById(decoded.id)
        if (!user) {
            user = await buyerSchema.findById(decoded.id)
        }

        if (user) {
            user.refreshToken = null
            await user.save()
        }

        res.clearCookie("refreshToken")

        return res.json({ message: "Logout successful" })

    } catch (err) {
        return res.status(400).json({ message: "Logout failed" })
    }
})

module.exports = router