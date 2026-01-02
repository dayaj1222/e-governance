import Verification from "../models/Verification.js";
import Complaint from "../models/Complaint.js";

export const createVerification = async (verificationData) => {
    const { complaintId, userId, isResolved, comment } = verificationData;

    const verification = new Verification({
        complaintId,
        userId,
        isResolved,
        comment,
    });

    await verification.save();

    // Get the complaint to check who created it
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
        throw new Error("Complaint not found");
    }

    // If original creator verified AND said it's resolved, mark as verified
    if (userId.toString() === complaint.createdBy.toString() && isResolved) {
        await Complaint.findByIdAndUpdate(complaintId, { status: "verified" });
    }

    // Optional: If 3+ people verify (including non-creators) after 7 days, auto-verify
    const verificationCount = await Verification.countDocuments({
        complaintId,
        isResolved: true,
    });

    const complaintAge = Date.now() - new Date(complaint.createdAt).getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    if (
        verificationCount >= 3 &&
        complaintAge > sevenDaysInMs &&
        complaint.status === "solved"
    ) {
        await Complaint.findByIdAndUpdate(complaintId, { status: "verified" });
    }

    return verification;
};

export const getVerificationsByComplaint = async (complaintId) => {
    return await Verification.find({ complaintId })
        .populate("userId", "name email")
        .sort("-createdAt");
};

export const hasUserVerified = async (complaintId, userId) => {
    const verification = await Verification.findOne({ complaintId, userId });
    return !!verification;
};
