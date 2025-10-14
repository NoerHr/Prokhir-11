const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
});

/**
 * Upload file ke Cloudinary
 */
const uploadToCloudinary = async (fileBuffer, folder = "lost-and-found", publicId = null) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    public_id: publicId,
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );
            uploadStream.end(fileBuffer);
        });
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

/**
 * Delete file dari Cloudinary
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error;
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};
