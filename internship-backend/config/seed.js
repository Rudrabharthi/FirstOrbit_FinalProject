import bcrypt from 'bcryptjs';
import { query } from './db.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...\n');

    // Clear existing data
    await query('DELETE FROM notifications');
    await query('DELETE FROM applications');
    await query('DELETE FROM internships');
    await query('DELETE FROM companies');
    await query('DELETE FROM students');
    await query('DELETE FROM users');

    // Hash passwords
    const adminPassword = await bcrypt.hash('Q111111', 10);
    const companyPassword = await bcrypt.hash('W111111', 10);
    const studentPassword = await bcrypt.hash('E111111', 10);

    // Insert demo users
    const adminResult = await query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      ['qq@gmail.com', adminPassword, 'admin']
    );

    const companyResult = await query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      ['ww@gmail.com', companyPassword, 'company']
    );

    const studentResult = await query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      ['ee@gmail.com', studentPassword, 'student']
    );

    const adminId = adminResult.rows[0].id;
    const companyUserId = companyResult.rows[0].id;
    const studentUserId = studentResult.rows[0].id;

    console.log('✅ Created demo users');

    // Insert student profile
    const studentProfileResult = await query(
      'INSERT INTO students (user_id, name, phone, department, skills) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [studentUserId, 'Demo Student', '9876543210', 'Computer Science', 'JavaScript, React, Node.js, Python']
    );

    console.log('✅ Created student profile');

    // Insert company profile
    const companyProfileResult = await query(
      'INSERT INTO companies (user_id, name, description, website, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [companyUserId, 'Tech Solutions Pvt Ltd', 'Leading software development company specializing in web and mobile applications.', 'https://techsolutions.example.com', true]
    );

    const companyId = companyProfileResult.rows[0].id;
    console.log('✅ Created company profile');

    // Insert sample internships
    await query(`
      INSERT INTO internships (company_id, title, description, required_skills, location, duration, stipend_type, stipend_amount, deadline, openings, eligibility_cgpa, eligible_departments, status)
      VALUES 
      ($1, 'Frontend Developer Intern', 'Join our team to build modern web applications using React and Next.js. You will work on real projects and learn from experienced developers.', 'React, JavaScript, HTML, CSS, Git', 'Remote', '3 months', 'Paid', 15000.00, '2026-03-31', 5, 7.0, 'Computer Science, Information Technology', 'active'),
      ($1, 'Backend Developer Intern', 'Work on server-side applications using Node.js and PostgreSQL. Great opportunity to learn about API development and database management.', 'Node.js, Express, PostgreSQL, REST APIs', 'Hybrid', '6 months', 'Paid', 20000.00, '2026-04-15', 3, 7.5, 'Computer Science, Information Technology, Electronics', 'active'),
      ($1, 'UI/UX Design Intern', 'Design beautiful and intuitive user interfaces for web and mobile applications. Collaborate with developers to bring designs to life.', 'Figma, Adobe XD, UI Design, Prototyping', 'On-site', '2 months', 'Paid', 12000.00, '2026-02-28', 2, 6.5, 'Computer Science, Design, Any', 'active')
    `, [companyId]);

    console.log('✅ Created sample internships');

    // Insert welcome notifications
    await query(`
      INSERT INTO notifications (user_id, title, message, type) VALUES
      ($1, 'Welcome Admin!', 'Welcome to the Internship Management System. You have full access to manage users, companies, and internships.', 'info'),
      ($2, 'Welcome to IMS!', 'Your company account has been approved. You can now post internships and view applicants.', 'success'),
      ($3, 'Welcome Student!', 'Start exploring internship opportunities and apply to kickstart your career!', 'info')
    `, [adminId, companyUserId, studentUserId]);

    console.log('✅ Created welcome notifications');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📋 Demo Accounts:');
    console.log('   Admin:   qq@gmail.com / Q111111');
    console.log('   Company: ww@gmail.com / W111111');
    console.log('   Student: ee@gmail.com / E111111');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
