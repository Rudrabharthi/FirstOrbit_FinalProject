import { query } from '../config/db.js';

// Get admin analytics
export const getAdminAnalytics = async (req, res) => {
  try {
    // Total internships
    const internshipsResult = await query('SELECT COUNT(*) as count FROM internships');
    const totalInternships = parseInt(internshipsResult.rows[0].count);
    
    // Total companies
    const companiesResult = await query('SELECT COUNT(*) as count FROM companies');
    const totalCompanies = parseInt(companiesResult.rows[0].count);
    
    // Total users
    const usersResult = await query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);
    
    // Total students
    const studentsResult = await query('SELECT COUNT(*) as count FROM students');
    const totalStudents = parseInt(studentsResult.rows[0].count);
    
    // Total applications
    const applicationsResult = await query('SELECT COUNT(*) as count FROM applications');
    const totalApplications = parseInt(applicationsResult.rows[0].count);
    
    // Accepted applications (placements)
    const acceptedResult = await query("SELECT COUNT(*) as count FROM applications WHERE status = 'accepted'");
    const acceptedApplications = parseInt(acceptedResult.rows[0].count);
    
    // Placement rate
    const placementRate = totalApplications > 0 
      ? Math.round((acceptedApplications / totalApplications) * 100) 
      : 0;
    
    // Recent internships
    const recentInternshipsResult = await query(`
      SELECT i.id, i.title, c.name as company_name, i.created_at
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      ORDER BY i.created_at DESC
      LIMIT 5
    `);
    
    // Applications by status
    const applicationsByStatusResult = await query(`
      SELECT status, COUNT(*) as count 
      FROM applications 
      GROUP BY status
    `);
    
    res.json({
      totalInternships,
      totalCompanies,
      totalUsers,
      totalStudents,
      totalApplications,
      acceptedApplications,
      placementRate,
      recentInternships: recentInternshipsResult.rows,
      applicationsByStatus: applicationsByStatusResult.rows
    });
  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({ message: 'Failed to get analytics', error: error.message });
  }
};

// Get company analytics
export const getCompanyAnalytics = async (req, res) => {
  try {
    // Get company ID
    const companyResult = await query('SELECT id FROM companies WHERE user_id = $1', [req.user.id]);
    if (companyResult.rows.length === 0) {
      return res.status(400).json({ message: 'Company profile not found' });
    }
    
    const companyId = companyResult.rows[0].id;
    
    // Total internships posted by company
    const internshipsResult = await query(
      'SELECT COUNT(*) as count FROM internships WHERE company_id = $1',
      [companyId]
    );
    const totalInternships = parseInt(internshipsResult.rows[0].count);
    
    // Active internships
    const activeResult = await query(
      "SELECT COUNT(*) as count FROM internships WHERE company_id = $1 AND status = 'active'",
      [companyId]
    );
    const activeInternships = parseInt(activeResult.rows[0].count);
    
    // Total applications received
    const applicationsResult = await query(`
      SELECT COUNT(*) as count 
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      WHERE i.company_id = $1
    `, [companyId]);
    const totalApplications = parseInt(applicationsResult.rows[0].count);
    
    // Pending applications
    const pendingResult = await query(`
      SELECT COUNT(*) as count 
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      WHERE i.company_id = $1 AND a.status = 'pending'
    `, [companyId]);
    const pendingApplications = parseInt(pendingResult.rows[0].count);
    
    // Applications by internship
    const applicationsByInternshipResult = await query(`
      SELECT i.id, i.title, COUNT(a.id) as application_count
      FROM internships i
      LEFT JOIN applications a ON i.id = a.internship_id
      WHERE i.company_id = $1
      GROUP BY i.id, i.title
      ORDER BY application_count DESC
    `, [companyId]);
    
    // Recent applicants
    const recentApplicantsResult = await query(`
      SELECT a.id, a.status, a.applied_at, s.name as student_name, i.title as internship_title
      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN internships i ON a.internship_id = i.id
      WHERE i.company_id = $1
      ORDER BY a.applied_at DESC
      LIMIT 10
    `, [companyId]);
    
    res.json({
      totalInternships,
      activeInternships,
      totalApplications,
      pendingApplications,
      applicationsByInternship: applicationsByInternshipResult.rows,
      recentApplicants: recentApplicantsResult.rows
    });
  } catch (error) {
    console.error('Get company analytics error:', error);
    res.status(500).json({ message: 'Failed to get analytics', error: error.message });
  }
};

// Generate report (Admin)
export const generateReport = async (req, res) => {
  try {
    const { type } = req.query;
    
    let data;
    
    switch (type) {
      case 'placements':
        data = await query(`
          SELECT s.name as student_name, s.department, i.title as internship_title, 
                 c.name as company_name, a.applied_at, a.updated_at as placed_at
          FROM applications a
          JOIN students s ON a.student_id = s.id
          JOIN internships i ON a.internship_id = i.id
          JOIN companies c ON i.company_id = c.id
          WHERE a.status = 'accepted'
          ORDER BY a.updated_at DESC
        `);
        break;
        
      case 'internships':
        data = await query(`
          SELECT i.*, c.name as company_name,
            (SELECT COUNT(*) FROM applications WHERE internship_id = i.id) as total_applications,
            (SELECT COUNT(*) FROM applications WHERE internship_id = i.id AND status = 'accepted') as accepted_count
          FROM internships i
          JOIN companies c ON i.company_id = c.id
          ORDER BY i.created_at DESC
        `);
        break;
        
      case 'students':
        data = await query(`
          SELECT s.*, u.email,
            (SELECT COUNT(*) FROM applications WHERE student_id = s.id) as total_applications,
            (SELECT COUNT(*) FROM applications WHERE student_id = s.id AND status = 'accepted') as accepted_count
          FROM students s
          JOIN users u ON s.user_id = u.id
          ORDER BY s.name
        `);
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    res.json({ type, data: data.rows });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};
