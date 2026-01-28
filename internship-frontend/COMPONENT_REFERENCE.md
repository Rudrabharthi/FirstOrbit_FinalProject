# Component & File Reference

## Pages (src/pages/)

### Authentication

- **LoginPage.js** - User login with email/password, role-based redirect
- **SignupPage.js** - User registration with role selection (student/company)
- **HomePage.js** - Landing page with features overview

### Dashboards

- **AdminDashboard.js** - Admin overview with stats, recent internships, quick actions
- **CompanyDashboard.js** - Company's internships, stats, applicant counts
- **StudentDashboard.js** - Application stats, recommended internships, recent applications

### Internships

- **InternshipListPage.js** - Browse all internships with search/filter
- **InternshipDetailsPage.js** - Detailed internship view, apply button for students
- **InternshipFormPage.js** - Create/Edit internship form (companies/admin)

### Applications

- **ApplicationListPage.js** - Student's applications with status filtering
- **ApplicantsPage.js** - Company view of applicants for specific internship

## Components (src/components/)

- **Navbar.js** - Role-based navigation menu, logout functionality
- **ProtectedRoute.js** - Route wrapper for role-based access control
- **InternshipCard.js** - Reusable internship display card
- **LoadingSpinner.js** - Loading indicator component

## Services (src/services/)

### API Configuration

- **api.js** - Axios instance with interceptors for auth tokens

### Service Modules

- **authService.js**

  - `login(email, password)` - User authentication
  - `signup(userData)` - User registration
  - `getProfile()` - Get current user
  - `updateProfile(userData)` - Update user profile

- **internshipService.js**

  - `getAll(filters)` - Get all internships with optional filters
  - `getById(id)` - Get single internship
  - `create(data)` - Create internship (company/admin)
  - `update(id, data)` - Update internship
  - `delete(id)` - Delete internship
  - `getByCompany(companyId)` - Get company's internships
  - `getApplicants(internshipId)` - Get applicants for internship

- **applicationService.js**

  - `apply(applicationData)` - Submit application (student)
  - `getMyApplications()` - Get user's applications
  - `getById(id)` - Get application details
  - `updateStatus(id, status)` - Update application status (company/admin)
  - `withdraw(id)` - Withdraw application (student)
  - `getAll()` - Get all applications (admin)

- **userService.js**
  - `getAll(role)` - Get all users, optionally filtered by role (admin)
  - `getById(id)` - Get user details
  - `update(id, userData)` - Update user (admin)
  - `delete(id)` - Delete user (admin)
  - `getCompanies()` - Get all companies
  - `getStudents()` - Get all students

## Context (src/context/)

- **AuthContext.js**
  - Provides: `user`, `token`, `loading`, `isAuthenticated`, `isAdmin`, `isCompany`, `isStudent`
  - Methods: `login(userData, token)`, `logout()`
  - Handles localStorage persistence

## Routing Structure (App.js)

### Public Routes

- `/` → HomePage
- `/login` → LoginPage
- `/signup` → SignupPage
- `/internships` → InternshipListPage
- `/internships/:id` → InternshipDetailsPage

### Admin Routes (Protected)

- `/admin` → AdminDashboard
- `/admin/internships` → InternshipListPage
- `/admin/internships/new` → InternshipFormPage
- `/admin/internships/edit/:id` → InternshipFormPage
- `/admin/companies` → Placeholder page
- `/admin/students` → Placeholder page

### Company Routes (Protected)

- `/company` → CompanyDashboard
- `/company/internships` → CompanyDashboard
- `/company/internships/new` → InternshipFormPage
- `/company/internships/edit/:id` → InternshipFormPage
- `/company/internships/:id/applicants` → ApplicantsPage

### Student Routes (Protected)

- `/student` → StudentDashboard
- `/student/applications` → ApplicationListPage

## Key Dependencies

- **react-router-dom** - Routing (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `Link`, `useNavigate`, `useParams`)
- **react-hook-form** - Form handling (`useForm`, `register`, `handleSubmit`, `formState`, `watch`)
- **axios** - HTTP requests
- **tailwindcss** - Styling

## Common Patterns

### API Call Pattern

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await service.method();
      setData(result);
    } catch (err) {
      setError("Error message");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Form Submission Pattern

```javascript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

const onSubmit = async (data) => {
  try {
    await service.method(data);
    navigate("/success-page");
  } catch (err) {
    setError(err.response?.data?.message);
  }
};
```

### Protected Route Usage

```javascript
<Route
  path="/protected"
  element={
    <ProtectedRoute allowedRoles={["admin", "company"]}>
      <ProtectedPage />
    </ProtectedRoute>
  }
/>
```

## Styling Guide

### Color Scheme

- **Primary**: Indigo (buttons, links, accents)
- **Success**: Green (accepted, active)
- **Warning**: Yellow (pending)
- **Danger**: Red (rejected, delete)
- **Neutral**: Gray (backgrounds, borders, text)

### Common Tailwind Classes

- Containers: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
- Cards: `bg-white rounded-lg shadow p-6`
- Buttons: `bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700`
- Input: `w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

## Environment Setup

Required `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

This value is used in `src/services/api.js` for the Axios base URL.
