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
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
});

// Cloudinary storage setup for store images
const storeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "store", // Store images in 'store' folder
    format: file.mimetype.split("/")[1], // Auto-detect format
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Resize images
  }),
});

// Multer instance for store images (e.g., store logos, banners)
export const storeUpload = multer({
  storage: storeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
});
