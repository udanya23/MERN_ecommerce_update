const mongoose = require("mongoose")

const BuyerSchema = mongoose.Schema({

    name: String,

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: String,

    otp: String,

    otpExpiry: Date,

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        default: "buyer"
    },

    refreshToken: String

}, { timestamps: true })

module.exports = mongoose.model("Buyer", BuyerSchema)