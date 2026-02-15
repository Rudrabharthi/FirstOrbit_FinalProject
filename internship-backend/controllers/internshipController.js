import { query } from '../config/db.js';

// Get all internships (public)
export const getAllInternships = async (req, res) => {
  try {
    const { search, location, status, company_id } = req.query;
    
    let sql = `
      SELECT i.*, c.name as company_name, c.logo_path as company_logo
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE c.is_approved = true
    `;
    const params = [];
    let paramIndex = 1;
    
    if (search) {
      sql += ` AND (i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex} OR i.required_skills ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (location) {
      sql += ` AND i.location = $${paramIndex}`;
      params.push(location);
      paramIndex++;
    }
    
    if (status) {
      sql += ` AND i.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (company_id) {
      sql += ` AND i.company_id = $${paramIndex}`;
      params.push(company_id);
      paramIndex++;
    }
    
    sql += ' ORDER BY i.created_at DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({ message: 'Failed to get internships', error: error.message });
  }
};

// Get internship by ID
export const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT i.*, c.name as company_name, c.description as company_description, 
             c.website as company_website, c.logo_path as company_logo
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE i.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({ message: 'Failed to get internship', error: error.message });
  }
};

// Create internship (Company only)
export const createInternship = async (req, res) => {
  try {
    const { title, description, required_skills, location, duration, stipend_type, stipend_amount, deadline, openings, eligibility_cgpa, eligible_departments } = req.body;
    
    // Get company ID from user
    const companyResult = await query('SELECT id FROM companies WHERE user_id = $1', [req.user.id]);
    if (companyResult.rows.length === 0) {
      return res.status(400).json({ message: 'Company profile not found' });
    }
    
    const company_id = companyResult.rows[0].id;
    
    const result = await query(`
      INSERT INTO internships (company_id, title, description, required_skills, location, duration, stipend_type, stipend_amount, deadline, openings, eligibility_cgpa, eligible_departments)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [company_id, title, description, required_skills, location, duration, stipend_type, stipend_amount || 0, deadline, openings || 1, eligibility_cgpa || 0, eligible_departments]);
    
    res.status(201).json({ message: 'Internship created successfully', internship: result.rows[0] });
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ message: 'Failed to create internship', error: error.message });
  }
};

// Update internship
export const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, required_skills, location, duration, stipend_type, stipend_amount, deadline, openings, eligibility_cgpa, eligible_departments, status } = req.body;
    
    // Check authorization
    const internshipResult = await query(`
      SELECT i.*, c.user_id 
      FROM internships i 
      JOIN companies c ON i.company_id = c.id 
      WHERE i.id = $1
    `, [id]);
    
    if (internshipResult.rows.length === 0) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    if (req.user.role !== 'admin' && internshipResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this internship' });
    }
