import express from 'express';
import { authUser, registerUser, updateUserProfile, getUsers, deleteUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.put('/profile', protect, updateUserProfile);

// Admin-only user management
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
