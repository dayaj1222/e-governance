import express from "express";
import * as userController from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/users/register
 * Body: { name, email, password, type: 'citizen' | 'authority', city? }
 * Returns: { user: { id, name, email, type, city }, token }
 */
router.post("/register", userController.register);

/**
 * POST /api/users/login
 * Body: { email, password }
 * Returns: { user: { id, name, email, type, city }, token }
 */
router.post("/login", userController.login);

/**
 * GET /api/users/profile
 * Headers: Authorization: Bearer <token>
 * Returns: { _id, name, email, type, city, createdAt }
 */
router.get("/profile", authenticate, userController.getProfile);

export default router;
