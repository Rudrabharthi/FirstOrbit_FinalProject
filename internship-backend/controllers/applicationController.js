import { query } from '../config/db.js';

// Apply for internship (Student only)
export const applyForInternship = async (req, res) => {
  try {
    const { internship_id } = req.body;
    let resumePath = null;

    if (req.file) {
      resumePath = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
    }
    
    // Get student ID
    const studentResult = await query('SELECT id, resume_path FROM students WHERE user_id = $1', [req.user.id]);
    if (studentResult.rows.length === 0) {
      return res.status(400).json({ message: 'Student profile not found' });
    }
    
    const student = studentResult.rows[0];
    const finalResumePath = resumePath || student.resume_path;

    if (!finalResumePath) {
      return res.status(400).json({ message: 'Resume is required. Please upload one or add to your profile.' });
    }
    
    // Check if internship exists and is active
    const internshipResult = await query(`
      SELECT i.*, c.name as company_name, c.user_id as company_user_id
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE i.id = $1 AND i.status = 'active'
    `, [internship_id]);
    
    if (internshipResult.rows.length === 0) {
      return res.status(404).json({ message: 'Internship not found or is no longer active' });
    }
    
    const internship = internshipResult.rows[0];
    
    // Check if already applied
    const existingApplication = await query(
      'SELECT id FROM applications WHERE internship_id = $1 AND student_id = $2',
      [internship_id, student.id]
    );
    
    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ message: 'You have already applied for this internship' });
    }
    
    // Create application
    const result = await query(`
      INSERT INTO applications (internship_id, student_id, resume_path, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `, [internship_id, student.id, finalResumePath]);
    
    // Notify company
    await query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
      [internship.company_user_id, 'New Application', `A student has applied for "${internship.title}"`, 'info']
    );
    
    res.status(201).json({ message: 'Application submitted successfully', application: result.rows[0] });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

// Get student's applications
export const getMyApplications = async (req, res) => {
  try {
    const studentResult = await query('SELECT id FROM students WHERE user_id = $1', [req.user.id]);
    if (studentResult.rows.length === 0) {
      return res.status(400).json({ message: 'Student profile not found' });
    }
    
    const result = await query(`
      SELECT a.*, i.title as internship_title, i.location, i.stipend_type, i.stipend_amount,
             c.name as company_name
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      JOIN companies c ON i.company_id = c.id
      WHERE a.student_id = $1
      ORDER BY a.applied_at DESC
    `, [studentResult.rows[0].id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to get applications', error: error.message });
  }
};

// Update application status (Company only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Get application with internship and company info
    const appResult = await query(`
      SELECT a.*, i.title as internship_title, c.user_id as company_user_id, s.user_id as student_user_id
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      JOIN companies c ON i.company_id = c.id
      JOIN students s ON a.student_id = s.id
      WHERE a.id = $1
    `, [id]);
    
    if (appResult.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    const application = appResult.rows[0];
    
    // Check authorization
    if (req.user.role !== 'admin' && application.company_user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    
    // Update status
    await query(
      'UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );
    
    // Notify student
    const statusMessage = status === 'accepted' 
      ? `Congratulations! Your application for "${application.internship_title}" has been accepted!`
      : status === 'rejected'
        ? `Your application for "${application.internship_title}" has been reviewed. Unfortunately, it was not accepted.`
        : `Your application status for "${application.internship_title}" has been updated to ${status}.`;
    
    await query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
      [application.student_user_id, 'Application Status Update', statusMessage, status === 'accepted' ? 'success' : status === 'rejected' ? 'warning' : 'info']
    );
    
    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Failed to update application status', error: error.message });
  }
};

// Withdraw application (Student only)
export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get student ID
    const studentResult = await query('SELECT id FROM students WHERE user_id = $1', [req.user.id]);
    if (studentResult.rows.length === 0) {
      return res.status(400).json({ message: 'Student profile not found' });
    }
    
    // Check if application belongs to student and is pending
    const appResult = await query(
      'SELECT * FROM applications WHERE id = $1 AND student_id = $2',
      [id, studentResult.rows[0].id]
    );
    
    if (appResult.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (appResult.rows[0].status !== 'pending') {
      return res.status(400).json({ message: 'Can only withdraw pending applications' });
    }
    
    await query('DELETE FROM applications WHERE id = $1', [id]);
    
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Failed to withdraw application', error: error.message });
  }
};

// Get all applications (Admin only)
export const getAllApplications = async (req, res) => {
  try {
    const result = await query(`
      SELECT a.*, i.title as internship_title, c.name as company_name, s.name as student_name, u.email as student_email
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      JOIN companies c ON i.company_id = c.id
      JOIN students s ON a.student_id = s.id
      JOIN users u ON s.user_id = u.id
      ORDER BY a.applied_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Failed to get applications', error: error.message });
  }
};
