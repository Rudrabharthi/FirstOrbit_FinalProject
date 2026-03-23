-- Internship Management System - Seed Data
-- Demo accounts for testing

-- Clear existing demo data
DELETE FROM notifications;
DELETE FROM applications;
DELETE FROM internships;
DELETE FROM companies;
DELETE FROM students;
DELETE FROM users;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE companies_id_seq RESTART WITH 1;
ALTER SEQUENCE internships_id_seq RESTART WITH 1;
ALTER SEQUENCE applications_id_seq RESTART WITH 1;
ALTER SEQUENCE notifications_id_seq RESTART WITH 1;

-- Insert Demo Users
-- Passwords are hashed using bcryptjs (plaintext shown in comments)
-- Admin: qq@gmail.com / Q111111
-- Company: ww@gmail.com / W111111
-- Student: ee@gmail.com / E111111

INSERT INTO users (email, password, role) VALUES
('qq@gmail.com', '$2a$10$8K1p/WbkF7yY5Fk5nMHU8.PGqzJzJr5YhVqJqGqe5R5pJdqJqGqe5', 'admin'),
('ww@gmail.com', '$2a$10$8K1p/WbkF7yY5Fk5nMHU8.PGqzJzJr5YhVqJqGqe5R5pJdqJqGqe5', 'company'),
('ee@gmail.com', '$2a$10$8K1p/WbkF7yY5Fk5nMHU8.PGqzJzJr5YhVqJqGqe5R5pJdqJqGqe5', 'student');

-- Insert Student Profile
INSERT INTO students (user_id, name, phone, department, skills) VALUES
(3, 'Demo Student', '9876543210', 'Computer Science', 'JavaScript, React, Node.js, Python');

-- Insert Company Profile
INSERT INTO companies (user_id, name, description, website, is_approved) VALUES
(2, 'Tech Solutions Pvt Ltd', 'Leading software development company specializing in web and mobile applications.', 'https://techsolutions.example.com', true);

-- Insert Sample Internships
INSERT INTO internships (company_id, title, description, required_skills, location, duration, stipend_type, stipend_amount, deadline, openings, eligibility_cgpa, eligible_departments, status) VALUES
(1, 'Frontend Developer Intern', 'Join our team to build modern web applications using React and Next.js. You will work on real projects and learn from experienced developers.', 'React, JavaScript, HTML, CSS, Git', 'Remote', '3 months', 'Paid', 15000.00, '2026-03-31', 5, 7.0, 'Computer Science, Information Technology', 'active'),
(1, 'Backend Developer Intern', 'Work on server-side applications using Node.js and PostgreSQL. Great opportunity to learn about API development and database management.', 'Node.js, Express, PostgreSQL, REST APIs', 'Hybrid', '6 months', 'Paid', 20000.00, '2026-04-15', 3, 7.5, 'Computer Science, Information Technology, Electronics', 'active'),
(1, 'UI/UX Design Intern', 'Design beautiful and intuitive user interfaces for web and mobile applications. Collaborate with developers to bring designs to life.', 'Figma, Adobe XD, UI Design, Prototyping', 'On-site', '2 months', 'Paid', 12000.00, '2026-02-28', 2, 6.5, 'Computer Science, Design, Any', 'active');

-- Insert Welcome Notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(1, 'Welcome Admin!', 'Welcome to the Internship Management System. You have full access to manage users, companies, and internships.', 'info'),
(2, 'Welcome to IMS!', 'Your company account has been approved. You can now post internships and view applicants.', 'success'),
(3, 'Welcome Student!', 'Start exploring internship opportunities and apply to kickstart your career!', 'info');

-- Insert Sample Interview Resources (YouTube Videos)
DELETE FROM interview_resources;
INSERT INTO interview_resources (youtube_url, title, description, created_by) VALUES
('https://www.youtube.com/watch?v=HG68Ymazo18', 'Top 10 Job Interview Questions & Answers (for 1st & 2nd Interviews)', 'Learn how to answer the most common job interview questions with confidence. Covers questions like Tell me about yourself, Why should we hire you, and more.', 1),
('https://www.youtube.com/watch?v=1qw5ITr3k9E', 'Self Introduction in Interview | How to Introduce Yourself', 'Master the art of self-introduction in interviews. This video covers the perfect structure for introducing yourself professionally.', 1),
('https://www.youtube.com/watch?v=Tt08KmFfIYQ', 'How To Introduce Yourself In An Interview! (The BEST ANSWER!)', 'A step-by-step guide on how to give the best self-introduction in any job interview. Includes sample answers and tips.', 1),
('https://www.youtube.com/watch?v=kayOhGRcNt4', 'How to Crack Any Interview | Interview Tips', 'Comprehensive guide covering body language, preparation strategies, common mistakes, and proven techniques to ace any interview.', 1),
('https://www.youtube.com/watch?v=2a30Hdp3V_Y', 'HR Interview Questions and Answers for Freshers', 'Essential HR interview questions every fresher should prepare for. Includes detailed answers and explanation of what the interviewer is looking for.', 1),
('https://www.youtube.com/watch?v=WEDIj9JBTC8', 'Top 6 Tips For The Fresher Job Interview', 'Practical tips specifically for freshers and students appearing for their first job or internship interviews. Covers resume, dress code, and communication.', 1);

-- Success message
SELECT 'Seed data inserted successfully!' as message;
SELECT 'Demo Accounts:' as info;
SELECT 'Admin: qq@gmail.com / Q111111' as admin_credentials;
SELECT 'Company: ww@gmail.com / W111111' as company_credentials;
SELECT 'Student: ee@gmail.com / E111111' as student_credentials;
