import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (userData) => {
    const { name, email, password, type, city } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        type,
        city: type === "authority" ? city : undefined,
    });

    await user.save();

    const token = jwt.sign(
        { id: user._id, type: user.type },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    return { user: { id: user._id, name, email, type, city }, token };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        { id: user._id, type: user.type },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            city: user.city,
        },
        token,
    };
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
