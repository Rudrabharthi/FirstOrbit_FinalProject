import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let sql = `
      SELECT u.id, u.email, u.role, u.created_at,
        COALESCE(s.name, c.name) as name,
        c.id as company_id,
        c.is_approved
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN companies c ON u.id = c.user_id
    `;
    const params = [];
    
    if (role) {
      sql += ' WHERE u.role = $1';
      params.push(role);
    }
    
    sql += ' ORDER BY u.created_at DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userResult = await query('SELECT id, email, role, created_at FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = userResult.rows[0];
    let profile = null;
    
    if (user.role === 'student') {
      const profileResult = await query('SELECT * FROM students WHERE user_id = $1', [id]);
      profile = profileResult.rows[0];
    } else if (user.role === 'company') {
      const profileResult = await query('SELECT * FROM companies WHERE user_id = $1', [id]);
      profile = profileResult.rows[0];
    }
    
    res.json({ ...user, profile });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

// Update user (Admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, name, phone, department, skills, companyName, companyDescription, website } = req.body;
    
    // Update email if provided
    if (email) {
      await query('UPDATE users SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [email, id]);
    }
    
    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, id]);
    }
    
    // Get user role
    const userResult = await query('SELECT role FROM users WHERE id = $1', [id]);
