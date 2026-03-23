import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, googleLogin } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'company', 'student']).withMessage('Valid role is required'),
  body('name').notEmpty().withMessage('Name is required')
], validate, register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, login);

// Get profile (protected)
router.get('/profile', auth, getProfile);

// Update profile (protected)
router.put('/profile', auth, updateProfile);

// Change password (protected)
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], validate, changePassword);

// Forgot password (public)
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], validate, forgotPassword);

// Reset password (public)
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Reset code must be 6 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], validate, resetPassword);

// Google OAuth Login
router.post('/google', googleLogin);

export default router;
