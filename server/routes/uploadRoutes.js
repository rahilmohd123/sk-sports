import express from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, uploadMiddleware, uploadImage);

export default router;
