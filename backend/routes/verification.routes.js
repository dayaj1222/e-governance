import express from "express";
import * as verificationController from "../controllers/verification.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/verifications
 * Headers: Authorization: Bearer <token>
 * Body: { complaintId, isResolved: boolean, comment? }
 * Returns: { _id, complaintId, userId, isResolved, comment, createdAt }
 */
router.post("/", authenticate, verificationController.createVerification);

/**
 * GET /api/verifications/complaint/:complaintId
 * Headers: Authorization: Bearer <token>
 * Returns: [{ verification objects with populated userId }]
 */
router.get(
    "/complaint/:complaintId",
    authenticate,
    verificationController.getVerifications,
);

/**
 * GET /api/verifications/check/:complaintId
 * Headers: Authorization: Bearer <token>
 * Returns: { hasVerified: boolean }
 */
router.get(
    "/check/:complaintId",
    authenticate,
    verificationController.checkVerification,
);

export default router;
