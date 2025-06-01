import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided");
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.error("File does not exist at the provided path");
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "SocialME", // Specify the folder in Cloudinary
        });

        // File has been uploaded successfully
        fs.unlinkSync(localFilePath); // Remove the local file
        console.log("File uploaded to Cloudinary:", response);

        return response;

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Remove the local file if it exists
        }
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
};

export { 
    uploadOnCloudinary 
};