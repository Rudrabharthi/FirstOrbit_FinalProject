# Internship Management System - Frontend

A comprehensive React-based frontend application for managing internships, built with Create React App.

## Overview

This is a full-featured internship management system that connects students with internship opportunities and helps companies manage their hiring process. The application features role-based access control with three distinct user types: Admin, Company, and Student.

## Features

### Authentication

- Login and Signup pages with form validation using `react-hook-form`
- Role-based authentication (Admin, Company, Student)
- Protected routes based on user roles
- Persistent authentication using localStorage and React Context

### Role-Based Dashboards

#### Admin Dashboard

- View and manage all internships, companies, and students
- Statistics overview with total counts
- Quick access to all management functions
- Edit/delete any internship or user

#### Company Dashboard

- Post and manage internships
- View and manage applicants for each internship
- Track posting and application statistics
- Edit/delete own internships

#### Student Dashboard

- Browse available internships
- Apply for internships
- Track application status (pending, accepted, rejected)
- View complete application history

### Internship Management

- Full CRUD operations
- Advanced search and filtering (by title, company, location, type)
- Detailed views with all information
- Fields: title, description, requirements, location, duration, stipend, deadline, status
- Status management (active/closed)

### Application System

- One-click application submission
- Companies can accept/reject applicants
- Real-time status tracking
- Withdraw pending applications

## Tech Stack

- **React 18** - Frontend framework (JavaScript)
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - Authentication state management

## Project Structure

```
src/
├── components/
│   ├── Navbar.js
│   ├── ProtectedRoute.js
│   ├── InternshipCard.js
│   └── LoadingSpinner.js
├── pages/
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── SignupPage.js
│   ├── AdminDashboard.js
│   ├── CompanyDashboard.js
│   ├── StudentDashboard.js
│   ├── InternshipListPage.js
│   ├── InternshipDetailsPage.js
│   ├── InternshipFormPage.js
│   ├── ApplicationListPage.js
│   └── ApplicantsPage.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── internshipService.js
│   ├── applicationService.js
│   └── userService.js
├── context/
│   └── AuthContext.js
├── App.js
└── index.js
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:

```bash
npm start
```

## API Endpoints

The frontend expects these backend API endpoints:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get user profile

### Internships

- `GET /api/internships` - Get all internships
- `GET /api/internships/:id` - Get internship by ID
- `POST /api/internships` - Create internship
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship
- `GET /api/internships/:id/applicants` - Get applicants

### Applications

- `POST /api/applications` - Apply for internship
- `GET /api/applications/my` - Get user's applications
- `PUT /api/applications/:id/status` - Update status
- `DELETE /api/applications/:id` - Withdraw application

### Users

- `GET /api/users` - Get all users (Admin)
- `GET /api/users/companies` - Get companies
- `GET /api/users/students` - Get students

## Key Features Implementation

### Authentication Flow

1. User submits credentials via Login/Signup form
2. Form validation with react-hook-form
3. API call via authService
4. Token and user data stored in Context + localStorage
5. Redirect to role-specific dashboard

### Role-Based Routing

- `ProtectedRoute` component validates authentication and role
- Routes configured with `allowedRoles` array
- Unauthorized access redirects to appropriate page
- Navbar shows role-specific menu items

### Search & Filter

- Real-time search across title, description, company
- Location and type filters
- Dynamic results update
- Clear filters functionality

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Environment Variables

- `REACT_APP_API_URL` - Backend API base URL (default: http://localhost:5000/api)

## Routing Structure

The application uses React Router with the following routes:

### Public Routes

- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/internships` - Browse all internships
- `/internships/:id` - Internship details

### Admin Routes

- `/admin` - Admin dashboard
- `/admin/internships` - Manage all internships
- `/admin/companies` - Manage companies
- `/admin/students` - Manage students
- `/admin/internships/new` - Create internship
- `/admin/internships/edit/:id` - Edit internship

### Company Routes

- `/company` - Company dashboard
- `/company/internships` - Company's internships
- `/company/internships/new` - Post new internship
- `/company/internships/edit/:id` - Edit internship
- `/company/internships/:id/applicants` - View applicants

### Student Routes

- `/student` - Student dashboard
- `/student/applications` - My applications

## Styling

The application uses Tailwind CSS with:

- Responsive design (mobile, tablet, desktop)
- Consistent indigo color scheme
- Card-based layouts
- Form validation states
- Loading indicators
- Status badges with semantic colors

## Notes

- **Frontend-only implementation** - Backend API must be implemented separately
- All API calls use axios with JWT token interceptors
- Authentication persists across page refreshes
- Comprehensive form validation with react-hook-form
- Error handling with user-friendly messages

## Future Enhancements

- Resume/document upload
- Real-time notifications
- Advanced analytics dashboard
- Email notifications
- Profile management
- Chat/messaging system
- Calendar integration
- Advanced user management pages

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
