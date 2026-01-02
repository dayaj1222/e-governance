import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export const isAuthority = (req, res, next) => {
    if (req.user.type !== "authority") {
        return res.status(403).json({ error: "Authority access only" });
    }
    next();
};

export const isCitizen = (req, res, next) => {
    if (req.user.type !== "citizen") {
        return res.status(403).json({ error: "Citizen access only" });
    }
    next();
};
