import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Gunaso API is running" });
});

// Error handling
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
