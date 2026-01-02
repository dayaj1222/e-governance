import * as complaintService from "../services/complaint.services.js";

export const createComplaint = async (req, res) => {
    try {
        const complaintData = { ...req.body, createdBy: req.userId };
        const complaint = await complaintService.createComplaint(complaintData);
        res.status(201).json(complaint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getComplaintsByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const filters = req.query;
        const complaints = await complaintService.getComplaintsByCity(
            city,
            filters,
        );
        res.status(200).json(complaints);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getComplaint = async (req, res) => {
    try {
        const complaint = await complaintService.getComplaintById(
            req.params.id,
        );
        res.status(200).json(complaint);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await complaintService.updateComplaintStatus(
            req.params.id,
            status,
            req.userId,
        );
        res.status(200).json(complaint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const upvote = async (req, res) => {
    try {
        const complaint = await complaintService.upvoteComplaint(req.params.id);
        res.status(200).json(complaint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getNearby = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        const complaints = await complaintService.getNearbyComplaints(
            parseFloat(lat),
            parseFloat(lng),
            parseFloat(radius),
        );
        res.status(200).json(complaints);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
