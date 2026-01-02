import * as userService from "../services/user.services.js";

export const register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
