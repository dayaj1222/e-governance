import cloudinary from "../utils/cloudinary.js";

export const uploadImages = async (files) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "gunaso" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                },
            );
            uploadStream.end(file.buffer);
        });
    });

    return await Promise.all(uploadPromises);
};
