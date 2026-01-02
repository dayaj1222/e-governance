import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: [
                "pothole",
                "streetlight",
                "garbage",
                "drainage",
                "water supply",
                "other",
            ],
            required: true,
        },
        city: { type: String, required: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "solved", "verified"],
            default: "pending",
        },
        urgency: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        images: [{ type: String }],
        upvoteCount: { type: Number, default: 0 },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);

export default mongoose.model("Complaint", ComplaintSchema);
