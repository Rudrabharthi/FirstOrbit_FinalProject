import { query } from '../config/db.js';

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, u.email 
      FROM companies c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Failed to get companies', error: error.message });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT c.*, u.email 
      FROM companies c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: 'Failed to get company', error: error.message });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, website } = req.body;
    
    // Check authorization
    const companyResult = await query('SELECT user_id FROM companies WHERE id = $1', [id]);
    if (companyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    if (req.user.role !== 'admin' && companyResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this company' });
    }
    
    await query(
      `UPDATE companies SET 
        name = COALESCE($1, name), 
        description = COALESCE($2, description), 
        website = COALESCE($3, website),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $4`,
      [name, description, website, id]
    );
    
    res.json({ message: 'Company updated successfully' });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ message: 'Failed to update company', error: error.message });
  }
};

// Delete company (Admin only)
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user_id to delete the user as well
    const companyResult = await query('SELECT user_id FROM companies WHERE id = $1', [id]);
    if (companyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Delete user (cascades to company)
    await query('DELETE FROM users WHERE id = $1', [companyResult.rows[0].user_id]);
    
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ message: 'Failed to delete company', error: error.message });
  }
};

// Approve company (Admin only)
export const approveCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    
    const result = await query(
      'UPDATE companies SET is_approved = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [approved !== false, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Notify company
    const company = result.rows[0];
    await query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
      [company.user_id, 'Account Status Update', approved ? 'Your company account has been approved!' : 'Your company account has been suspended.', approved ? 'success' : 'warning']
    );
    
    res.json({ message: `Company ${approved ? 'approved' : 'suspended'} successfully` });
  } catch (error) {
    console.error('Approve company error:', error);
    res.status(500).json({ message: 'Failed to update company status', error: error.message });
  }
};
