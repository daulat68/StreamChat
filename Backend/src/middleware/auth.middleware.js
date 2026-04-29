import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute= async (req, res, next) => {
    try {
        console.log("----- NEW REQUEST -----");

        console.log("HEADERS COOKIE:", req.headers.cookie);
        console.log("COOKIES PARSED:", req.cookies);

        console.log("JWT FROM COOKIES:", req.cookies?.jwt);

        if (req.headers.cookie) {
        const match = req.headers.cookie.match(/jwt=([^;]+)/);
        console.log("JWT FROM RAW HEADER:", match ? match[1] : "NOT FOUND");
        }
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user) {
            return res.status(404).json({ message: "User not found"})
        }

        req.user = user
        next()
    }
    catch (error) {
        console.log("Error in protectRoute middleware", error.message)
        res.status(500).json({message: "Internal server error"})
    }
} 