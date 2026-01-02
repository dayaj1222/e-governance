import express from "express";
import * as uploadController from "../controllers/upload.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

/**
 * POST /api/upload
 * Headers: Authorization: Bearer <token>
 * Body: multipart/form-data with field name "images" (max 3 files)
 * Returns: { urls: ["url1", "url2", "url3"] }
 */
router.post(
    "/",
    authenticate,
    upload.array("images", 3),
    uploadController.uploadImages,
);

export default router;
