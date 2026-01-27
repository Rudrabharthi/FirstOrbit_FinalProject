# Quick Start Guide

## Getting Started

1. **Navigate to the project directory:**

```bash
cd "c:\Users\Hp\OneDrive\Desktop\Internship Management System\internship-frontend"
```

2. **The project is already set up with all dependencies installed**

3. **Create a `.env` file (copy from .env.example):**

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server:**

```bash
npm start
```

The application will automatically open in your browser at http://localhost:3000

## Test Credentials

Since this is a frontend-only application, you'll need a backend API running. Once the backend is set up, you can use it to create test users with different roles:

- **Admin** - Full access to all features
- **Company** - Can post and manage internships, view applicants
- **Student** - Can browse and apply for internships

## Navigation Flow

### For Students:

1. Sign up with role "Student"
2. Browse internships at `/internships`
3. Click on an internship to view details
4. Click "Apply Now" to submit application
5. View your applications at `/student/applications`

### For Companies:

1. Sign up with role "Company"
2. Post a new internship at `/company/internships/new`
3. View your posted internships at `/company`
4. Click on "View Applicants" to see who applied
5. Accept or reject applications

### For Admin:

1. Admin accounts are typically created through backend
2. Access admin dashboard at `/admin`
3. Manage all internships, companies, and students
4. View system-wide statistics

## Key Features to Test

✅ **Authentication**

- Login/Signup with form validation
- Role-based dashboard redirection
- Protected routes

✅ **Internship Management**

- Create/Edit/Delete internships (Company/Admin)
- Search and filter internships
- View detailed internship information

✅ **Application System**

- Apply for internships (Students)
- View application history
- Withdraw pending applications
- Accept/Reject applicants (Companies)

✅ **Dashboards**

- Role-specific statistics
- Quick actions
- Recent activity

## File Structure Overview

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components for each route
├── services/         # API service layer (axios)
├── context/          # React Context for auth
├── App.js            # Main routing configuration
└── index.css         # Tailwind CSS imports
```

## Common Tasks

### Add a new page:

1. Create component in `src/pages/`
2. Add route in `src/App.js`
3. Add navigation link in `src/components/Navbar.js`

### Add a new API endpoint:

1. Add function to appropriate service file in `src/services/`
2. Use the service in your component

### Modify styling:

- All components use Tailwind CSS classes
- Global styles in `src/index.css`
- Custom config in `tailwind.config.js`

## Troubleshooting

**Port already in use:**

```bash
# The app will prompt to use a different port (e.g., 3001)
# Or kill the process using port 3000
```

**API connection errors:**

- Ensure `REACT_APP_API_URL` is set correctly in `.env`
- Make sure backend server is running
- Check browser console for specific errors

**Build errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Set up the backend API
2. Test all user flows
3. Customize styling and branding
4. Add additional features as needed
5. Deploy to production

Happy coding! 🚀
