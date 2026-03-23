import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import InternshipListPage from "./pages/InternshipListPage";
import InternshipDetailsPage from "./pages/InternshipDetailsPage";
import InternshipFormPage from "./pages/InternshipFormPage";
import ApplicationListPage from "./pages/ApplicationListPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import UserManagementPage from "./pages/UserManagementPage";
import CompanyManagementPage from "./pages/CompanyManagementPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import InterviewResourcesPage from "./pages/InterviewResourcesPage";
import AdminInterviewResourcesPage from "./pages/AdminInterviewResourcesPage";

function MainContent() {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();

  // Calculate margin based on sidebar state
  const mainMargin = isAuthenticated 
    ? isCollapsed ? 'lg:ml-20' : 'lg:ml-64' 
    : '';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${mainMargin}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/internships" element={<InternshipListPage />} />
            <Route path="/internships/:id" element={<InternshipDetailsPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/internships"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <InternshipListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/internships/new"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <InternshipFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/internships/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <InternshipFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/companies"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CompanyManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/interview-resources"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminInterviewResourcesPage />
                </ProtectedRoute>
              }
            />

            {/* Company Routes */}
            <Route
              path="/company"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/internships"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/internships/new"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <InternshipFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/internships/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <InternshipFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/internships/:id/applicants"
              element={
                <ProtectedRoute allowedRoles={["company", "admin"]}>
                  <ApplicantsPage />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ApplicationListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/interview-resources"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <InterviewResourcesPage />
                </ProtectedRoute>
              }
            />

            {/* Profile Route (all authenticated users) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["admin", "company", "student"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <MainContent />
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
