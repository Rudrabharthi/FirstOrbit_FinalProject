import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get display name from user profile
  const displayName = user?.profile?.name || user?.email?.split('@')[0] || 'User';
  const roleLabel = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || '';

  return (
    <nav className={`h-16 shadow-sm border-b transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-lavender border-lavender'}`}>
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Left Side - Logo (for non-authenticated) or spacer */}
          <div className="flex items-center">
            {!isAuthenticated && (
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="IMS Logo" className="h-10" />
              </Link>
            )}
            {isAuthenticated && (
              <div className="lg:ml-64">
                {/* Spacer for sidebar */}
              </div>
            )}
          </div>

          {/* Right Side - Theme Toggle, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
