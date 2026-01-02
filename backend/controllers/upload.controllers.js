import * as uploadService from "../services/upload.services.js";

export const uploadImages = async (req, res) => {
    try {
        console.log("Upload request received");
        console.log("Files:", req.files);
        console.log("Body:", req.body);

        if (!req.files || req.files.length === 0) {
            console.log("No files in request");
            return res.status(400).json({ error: "No images provided" });
        }

        const urls = await uploadService.uploadImages(req.files);
        console.log("Upload successful, URLs:", urls);
        res.status(200).json({ urls });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(400).json({ error: error.message });
    }
};
