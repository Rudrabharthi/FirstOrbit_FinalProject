import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../config/db.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, role, name, phone, department, skills, companyName, companyDescription, website } = req.body;

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );
    const user = userResult.rows[0];

    // Create role-specific profile
    if (role === 'student') {
      await query(
        'INSERT INTO students (user_id, name, phone, department, skills) VALUES ($1, $2, $3, $4, $5)',
        [user.id, name, phone || null, department || null, skills || null]
      );
    } else if (role === 'company') {
      await query(
        'INSERT INTO companies (user_id, name, description, website, is_approved) VALUES ($1, $2, $3, $4, $5)',
        [user.id, companyName || name, companyDescription || null, website || null, false]
      );
    }

    // Create welcome notification
    await query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
      [user.id, 'Welcome!', `Welcome to the Internship Management System. Your ${role} account has been created successfully.`, 'success']
    );

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Get profile based on role
    let profile = null;
    if (user.role === 'student') {
      const profileResult = await query('SELECT * FROM students WHERE user_id = $1', [user.id]);
      profile = profileResult.rows[0] || null;
    } else if (user.role === 'company') {
      const profileResult = await query('SELECT * FROM companies WHERE user_id = $1', [user.id]);
      profile = profileResult.rows[0] || null;
      
      // Check if company is approved
      if (profile && !profile.is_approved) {
        return res.status(403).json({ 
          message: 'Your company account is pending approval. Please wait for admin to approve your account.',
          pendingApproval: true
        });
      }
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let profile = null;
    if (role === 'student') {
      const result = await query('SELECT * FROM students WHERE user_id = $1', [userId]);
      profile = result.rows[0] || null;
    } else if (role === 'company') {
      const result = await query('SELECT * FROM companies WHERE user_id = $1', [userId]);
      profile = result.rows[0] || null;
    }

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        profile
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { name, phone, department, skills, companyName, companyDescription, website } = req.body;

    if (role === 'student') {
      await query(
        'UPDATE students SET name = $1, phone = $2, department = $3, skills = $4, updated_at = CURRENT_TIMESTAMP WHERE user_id = $5',
        [name, phone, department, skills, userId]
      );
    } else if (role === 'company') {
      await query(
        'UPDATE companies SET name = $1, description = $2, website = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $4',
        [companyName || name, companyDescription, website, userId]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Change password (authenticated user)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get user's current password
    const userResult = await query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, userId]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};

// Google OAuth Login
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists by google_id or email
    let userResult = await query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    let user;

    if (userResult.rows.length === 0) {
      // Create new user (default role: student)
      const newUserResult = await query(
        'INSERT INTO users (email, google_id, role) VALUES ($1, $2, $3) RETURNING id, email, role',
        [email, googleId, 'student']
      );
      user = newUserResult.rows[0];

      // Create student profile with Google name
      await query(
        'INSERT INTO students (user_id, name) VALUES ($1, $2)',
        [user.id, name || 'Google User']
      );

      // Create welcome notification
      await query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
        [user.id, 'Welcome!', 'Welcome to FirstOrbit! Your account has been created via Google.', 'success']
      );
    } else {
      user = userResult.rows[0];

      // Update google_id if user exists by email but doesn't have google_id
      if (!user.google_id) {
        await query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
      }
    }

    // Get profile based on role
    let profile = null;
    if (user.role === 'student') {
      const profileResult = await query('SELECT * FROM students WHERE user_id = $1', [user.id]);
      profile = profileResult.rows[0] || null;
    } else if (user.role === 'company') {
      const profileResult = await query('SELECT * FROM companies WHERE user_id = $1', [user.id]);
      profile = profileResult.rows[0] || null;
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      message: 'Google login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile
      },
      token
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Google authentication failed', error: error.message });
  }
};

// Simple password reset token storage (in production, use a proper table or Redis)
const resetTokens = new Map();

// Forgot password - generates a reset token and sends email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const userResult = await query('SELECT id, email FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // Don't reveal if email exists for security
      return res.json({ message: 'If this email is registered, you will receive a reset code.' });
    }

    const user = userResult.rows[0];

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset token with expiry (15 minutes)
    resetTokens.set(email, {
      code: resetCode,
      userId: user.id,
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });

    // Send email with reset code
    const emailResult = await sendPasswordResetEmail(email, resetCode);
    
    if (emailResult.success) {
      console.log(`Reset code sent to ${email}`);
      res.json({ 
        message: 'If this email is registered, you will receive a reset code shortly.',
        emailSent: true
      });
    } else {
      // Email failed but still show same message for security
      console.error('Email sending failed:', emailResult.error);
      res.json({ 
        message: 'If this email is registered, you will receive a reset code.',
        // For development/debugging only
        demoCode: resetCode,
        emailError: emailResult.error
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process request', error: error.message });
  }
};

// Reset password with code
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Check if reset token exists
    const tokenData = resetTokens.get(email);
    if (!tokenData) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Check if code matches and hasn't expired
    if (tokenData.code !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (Date.now() > tokenData.expires) {
      resetTokens.delete(email);
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, tokenData.userId]);

    // Clear the reset token
    resetTokens.delete(email);

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
};
