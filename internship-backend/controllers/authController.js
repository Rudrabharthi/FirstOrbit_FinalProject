import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

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
