import * as verificationService from "../services/verification.services.js";

export const createVerification = async (req, res) => {
    try {
        const verificationData = { ...req.body, userId: req.userId };
        const verification =
            await verificationService.createVerification(verificationData);
        res.status(201).json(verification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getVerifications = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const verifications =
            await verificationService.getVerificationsByComplaint(complaintId);
        res.status(200).json(verifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const checkVerification = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const hasVerified = await verificationService.hasUserVerified(
            complaintId,
            req.userId,
        );
        res.status(200).json({ hasVerified });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
