import Complaint from "../models/Complaint.js";

export const createComplaint = async (complaintData) => {
    const complaint = new Complaint(complaintData);
    await complaint.save();
    return complaint;
};

export const getComplaintsByCity = async (city, filters = {}) => {
    const query = { city, ...filters };
    return await Complaint.find(query)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort("-createdAt");
};

export const getComplaintById = async (complaintId) => {
    const complaint = await Complaint.findById(complaintId)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
    if (!complaint) {
        throw new Error("Complaint not found");
    }
    return complaint;
};

export const updateComplaintStatus = async (
    complaintId,
    status,
    authorityId,
) => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new Error("Complaint not found");
    }

    complaint.status = status;
    if (!complaint.assignedTo) {
        complaint.assignedTo = authorityId;
    }

    await complaint.save();
    return complaint;
};

export const upvoteComplaint = async (complaintId) => {
    const complaint = await Complaint.findByIdAndUpdate(
        complaintId,
        { $inc: { upvoteCount: 1 } },
        { new: true },
    );
    if (!complaint) {
        throw new Error("Complaint not found");
    }
    return complaint;
};

export const getNearbyComplaints = async (lat, lng, radiusInKm = 1) => {
    const complaints = await Complaint.find({
        "location.lat": {
            $gte: lat - radiusInKm / 111,
            $lte: lat + radiusInKm / 111,
        },
        "location.lng": {
            $gte: lng - radiusInKm / 111,
            $lte: lng + radiusInKm / 111,
        },
    }).populate("createdBy", "name");

    return complaints;
};
