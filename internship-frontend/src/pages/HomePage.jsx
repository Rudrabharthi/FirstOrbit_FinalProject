import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, isAdmin, isCompany, isStudent } = useAuth();

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isCompany) return "/company";
    if (isStudent) return "/student";
    return "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl mb-6">
            Welcome to the
            <span className="text-indigo-600 dark:text-indigo-400">
              {" "}
              FirstOrbit <br />
              <br />
            </span>
            Where Your Professional Mission Begins
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Connect students with amazing internship opportunities and help
            companies find talented interns. Streamline your internship
            application process today!
          </p>

          {isAuthenticated ? (
            <Link
              to={getDashboardLink()}
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 shadow-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600 shadow-lg"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

