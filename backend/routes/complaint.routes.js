import express from "express";
import * as complaintController from "../controllers/complaint.controllers.js";
import { authenticate, isAuthority } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/complaints
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, category, city, location: { lat, lng }, urgency, images: [] }
 * Returns: { _id, title, description, category, city, location, status, urgency, images, upvoteCount, createdBy, assignedTo, createdAt, updatedAt }
 */
router.post("/", authenticate, complaintController.createComplaint);

/**
 * GET /api/complaints/city/:city
 * Headers: Authorization: Bearer <token>
 * Query: ?status=pending&urgency=high&category=pothole
 * Returns: [{ complaint objects with populated createdBy and assignedTo }]
 */
router.get(
    "/city/:city",
    authenticate,
    complaintController.getComplaintsByCity,
);

/**
 * GET /api/complaints/nearby
 * Headers: Authorization: Bearer <token>
 * Query: ?lat=27.7172&lng=85.3240&radius=1
 * Returns: [{ complaint objects }]
 */
router.get("/nearby", authenticate, complaintController.getNearby);

/**
 * GET /api/complaints/:id
 * Headers: Authorization: Bearer <token>
 * Returns: { complaint object with populated createdBy and assignedTo }
 */
router.get("/:id", authenticate, complaintController.getComplaint);

/**
 * PATCH /api/complaints/:id/status
 * Headers: Authorization: Bearer <token>
 * Body: { status: 'pending' | 'in-progress' | 'solved' | 'verified' }
 * Returns: { updated complaint object }
 */
router.patch(
    "/:id/status",
    authenticate,
    isAuthority,
    complaintController.updateStatus,
);

/**
 * POST /api/complaints/:id/upvote
 * Headers: Authorization: Bearer <token>
 * Returns: { updated complaint object with incremented upvoteCount }
 */
router.post("/:id/upvote", authenticate, complaintController.upvote);

export default router;
