import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.cloudinaryCloudName,
    api_key: process.env.cloudinaryApiKey,
    api_secret: process.env.cloudinaryApiSecret
});

export default cloudinary;
