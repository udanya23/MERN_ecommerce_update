const express = require("express")
const router = express.Router()
const transporter = require("../utils/sendEmail")
const sellerSchema = require("../models/Seller")
const bcrypt = require("bcrypt")
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens")

router.post("/send-otp", async (req, res) => {

    const { email } = req.body

    try {
        let seller = await sellerSchema.findOne({ email })

        const otp = Math.floor(10000 + Math.random() * 90000).toString()

        if (!seller) {
            seller = new sellerSchema({ email })
        }

        seller.otp = otp
        seller.otpExpiry = Date.now() + 5 * 60 * 1000

        await seller.save()

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OTP for Email Verification",
            html: `<h3>Your OTP is: ${otp}</h3>`
        })

        return res.status(200).json({ message: "OTP sent to email" })

    } catch (err) {
        console.log("Send OTP Error:", err)
        return res.status(500).json({ message: err.message })
    }
})

router.post("/verify-otp", async (req, res) => {

    const { email, otp } = req.body

    try {
        const seller = await sellerSchema.findOne({ email })

        if (!seller)
            return res.status(400).json({ message: "Email not found" })

        if (seller.otp !== otp || seller.otpExpiry < Date.now())
            return res.status(400).json({ message: "Invalid or expired OTP" })

        seller.isEmailVerified = true
        seller.otp = null
        seller.otpExpiry = null

        await seller.save()

        return res.status(200).json({ message: "Email verified successfully" })

    } catch (err) {
        console.log("Verify OTP Error:", err)
        return res.status(500).json({ message: err.message })
    }
})

router.post("/register", async (req, res) => {

    const { name, email, password } = req.body

    try {
        const seller = await sellerSchema.findOne({ email })

        if (!seller)
            return res.status(400).json({ message: "Email not found. Verify first." })

        if (!seller.isEmailVerified)
            return res.status(400).json({ message: "Email not verified" })

        const hashedPassword = await bcrypt.hash(password, 10)

        seller.name = name
        seller.password = hashedPassword
        seller.role = "seller"

        await seller.save()

        return res.status(201).json({ message: "Seller registration successful" })

    } catch (err) {
        console.log("Seller Register Error:", err)
        return res.status(500).json({ message: err.message })
    }
})

router.post("/login", async (req, res) => {

    const { email, password } = req.body

    try {
        const seller = await sellerSchema.findOne({ email })

        if (!seller)
            return res.status(400).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, seller.password)

        if (!isMatch)
            return res.status(400).json({ message: "Password is incorrect" })

        // ✅ Pass entire seller object (so role is included)
        const accessToken = generateAccessToken(seller)
        const refreshToken = generateRefreshToken(seller)

        seller.refreshToken = refreshToken
        await seller.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            accessToken,
            user: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                role: seller.role
            }
        })

    } catch (err) {
        console.log("Seller Login Error:", err)
        return res.status(500).json({ message: "Server Error" })
    }
})

module.exports = router