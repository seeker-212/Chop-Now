import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinnary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // delete only if file exists
    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Cloudinary upload error:", error.message);
    throw error; // let controller handle it
  }
};

export default uploadToCloudinnary;
