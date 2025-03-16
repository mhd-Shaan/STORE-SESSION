import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "product",
    format: file.mimetype.split("/")[1], // Auto-detect format
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

// Multer upload instance (allows multiple images)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
});

export default upload;
