import express from 'express';
import { authUser, registerUser, updateUserProfile, getUsers, createUser, updateUser, deleteUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.put('/profile', protect, updateUserProfile);

router.route('/users')
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser);

router.route('/users/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
