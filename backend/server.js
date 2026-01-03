import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (these must come BEFORE static file serving)
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/upload", uploadRoutes);

// Health check for API
app.get("/api/health", (req, res) => {
    res.json({ message: "Gunaso API is running", status: "ok" });
});

// Serve static files from React build
const frontendPath = path.join(__dirname, "../frontend/dist");
console.log("Serving frontend from:", frontendPath);

app.use(express.static(frontendPath));

// Catch-all route for SPA - uses middleware function instead of route pattern
app.use((req, res, next) => {
    // If the request is not for API, send index.html
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(frontendPath, "index.html"));
    } else {
        next();
    }
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Connect DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
