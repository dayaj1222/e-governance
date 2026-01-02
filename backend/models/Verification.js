import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isResolved: { type: Boolean, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Verification", VerificationSchema);
