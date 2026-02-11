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
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const role = userResult.rows[0].role;
    
    // Update profile based on role
    if (role === 'student' && (name || phone || department || skills)) {
      await query(
        `UPDATE students SET 
          name = COALESCE($1, name), 
          phone = COALESCE($2, phone), 
          department = COALESCE($3, department), 
          skills = COALESCE($4, skills),
          updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = $5`,
        [name, phone, department, skills, id]
      );
    } else if (role === 'company' && (companyName || companyDescription || website)) {
      await query(
        `UPDATE companies SET 
          name = COALESCE($1, name), 
          description = COALESCE($2, description), 
          website = COALESCE($3, website),
          updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = $4`,
        [companyName, companyDescription, website, id]
      );
    }
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Delete user (Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Get students only
export const getStudents = async (req, res) => {
  try {
    const result = await query(`
      SELECT u.id, u.email, u.created_at, s.name, s.phone, s.department, s.skills, s.resume_path
      FROM users u
      JOIN students s ON u.id = s.user_id
      ORDER BY s.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Failed to get students', error: error.message });
  }
};
