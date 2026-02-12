import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getStudents } from '../controllers/userController.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(auth);
router.use(isAdmin);

// Get all users
router.get('/', getAllUsers);

// Get students only
router.get('/students', getStudents);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;
