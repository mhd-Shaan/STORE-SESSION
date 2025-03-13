import express from 'express';
import upload from '../config/multer.js'; // Import multer config

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path }); // Cloudinary URL
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed' });
  }
});

export const addproduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Cloudinary automatically stores the file and returns a URL
        const imageUrl = req.file.path;

        res.status(200).json({ message: 'File uploaded successfully', imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'File upload failed', error });
    }
};


export default router;
