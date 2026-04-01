const express = require("express")
const router = express.Router()
const transporter = require("../utils/sendEmail")
const Buyer = require("../models/Buyer")
const bcrypt = require("bcrypt")
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens")

router.post("/send-otp", async (req, res) => {

    const { email } = req.body

    try {

        let buyer = await Buyer.findOne({ email })

        const otp = Math.floor(10000 + Math.random() * 90000).toString()

        if (!buyer) {
            buyer = new Buyer({ email })
        }

        buyer.otp = otp
        buyer.otpExpiry = Date.now() + 5 * 60 * 1000

        await buyer.save()

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OTP for Buyer Email Verification",
            html: `<h3>Your OTP is: ${otp}</h3>`
        })

        return res.status(200).json({ message: "OTP sent successfully" })

    } catch (err) {
        console.log("Buyer OTP Error:", err)
        return res.status(500).json({ message: err.message })
    }
})

router.post("/verify-otp", async (req, res) => {

    const { email, otp } = req.body

    try {

        const buyer = await Buyer.findOne({ email })

        if (!buyer)
            return res.status(400).json({ message: "Email not found" })

        if (buyer.otp !== otp || buyer.otpExpiry < Date.now())
            return res.status(400).json({ message: "Invalid or expired OTP" })

        buyer.isEmailVerified = true
        buyer.otp = null
        buyer.otpExpiry = null

        await buyer.save()

        return res.status(200).json({ message: "Email verified successfully" })

    } catch (err) {
        console.log("Verify OTP Error:", err)
        return res.status(500).json({ message: err.message })
    }
})
router.post("/register", async (req, res) => {

    const { name, email, password } = req.body

    try {

        const buyer = await Buyer.findOne({ email })

        if (!buyer)
            return res.status(400).json({ message: "Email not found. Verify first." })

        if (!buyer.isEmailVerified)
            return res.status(400).json({ message: "Email not verified" })

        const hashedPassword = await bcrypt.hash(password, 10)

        buyer.name = name
        buyer.password = hashedPassword
        buyer.role = "buyer"

        await buyer.save()

        return res.status(201).json({ message: "Buyer registration successful" })

    } catch (err) {
        console.log("Buyer Register Error:", err)
        return res.status(500).json({ message: err.message })
    }
})

router.post("/login", async (req, res) => {

    const { email, password } = req.body

    try {

        const buyer = await Buyer.findOne({ email })

        if (!buyer)
            return res.status(400).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, buyer.password)

        if (!isMatch)
            return res.status(400).json({ message: "Password incorrect" })

        // ✅ Pass full buyer object
        const accessToken = generateAccessToken(buyer)
        const refreshToken = generateRefreshToken(buyer)

        buyer.refreshToken = refreshToken
        await buyer.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            accessToken,
            user: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                role: buyer.role
            }
        })

    } catch (err) {
        console.log("Buyer Login Error:", err)
        return res.status(500).json({ message: "Server error" })
    }
})

module.exports = router