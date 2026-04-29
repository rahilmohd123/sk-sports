import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64 or use upload_stream
    const fileBuffer = req.file.buffer;
    const base64File = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'sk-sports-products',
    });

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Cloudinary upload failed' });
  }
};

export const uploadMiddleware = upload.single('image');
