const jwt = require("jsonwebtoken")
const Seller = require("../models/Seller")
const Buyer = require("../models/Buyer")

const protect = async (req, res, next) => {

    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        try {

            token = req.headers.authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            let user

            // 🔹 Check role and fetch correct user
            if (decoded.role === "seller") {

                user = await Seller.findById(decoded.id)
                    .select("-password -refreshToken")

            }
            else if (decoded.role === "buyer") {

                user = await Buyer.findById(decoded.id)
                    .select("-password -refreshToken")

            }

            if (!user) {
                return res.status(401).json({ message: "User not found" })
            }

            req.user = user

            next()

        }
        catch (err) {

            return res.status(401).json({
                message: "Token invalid"
            })

        }

    }
    else {

        return res.status(401).json({
            message: "No token provided"
        })

    }

}



const authorizeRole = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access denied for this role"
            })

        }

        next()

    }

}

module.exports = { protect, authorizeRole }