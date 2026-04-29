import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  getUsers,
  deleteUser,
  syncCart,
  updateCart,
  getUserCart,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/', protect, admin, getUsers);

// Profile routes  
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Address routes — MUST be before /:id
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.put('/addresses/:addressId/default', protect, setDefaultAddress);
+
+// Cart routes
+router.get('/cart', protect, getUserCart);
+router.put('/cart', protect, updateCart);
+router.post('/cart/sync', protect, syncCart);

// Parameterized route LAST
router.delete('/:id', protect, admin, deleteUser);

export default router;
