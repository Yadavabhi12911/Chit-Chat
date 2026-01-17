

import { v2 as cloudinary } from "cloudinary"

import ApiError from './ApiError.js';
import fs from 'fs'


cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

const uploadImageOnCloudinary = async (imageLocalPath) => {

    if (!imageLocalPath) return console.log(" path not available");
    
    if (!fs.existsSync(imageLocalPath)) {
        throw new ApiError(400, "file not present at specified path")
    }
    
    try {
      
        const response = await cloudinary.uploader.upload(imageLocalPath, {
            folder: "ChitChat/users",
            resource_type: "image"
        })
        

        console.log("image uploaded successfully");

        fs.unlinkSync(imageLocalPath)

        return response

    } catch (error) {

        if (fs.existsSync(imageLocalPath)) {
            fs.unlinkSync(imageLocalPath);
        }

        console.log("error while uploading image on cloudinary", error);
        throw new ApiError(500, "Failed to upload image on Cloudinary");
    }
}



export { uploadImageOnCloudinary}
