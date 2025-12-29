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

      {/* About FirstOrbit Section */}
      <div className="bg-indigo-50 dark:bg-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - About Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About <span className="text-indigo-600 dark:text-indigo-400">FirstOrbit</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Launched with a single mission: to help students defy the gravity of unemployment. 
                FirstOrbit was built to serve as the launchpad for your professional journey.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We believe every student deserves a successful liftoff. By simplifying the internship 
                management process, we connect ambitious learners with the companies that need them most, 
                creating a perfect alignment of skill and opportunity.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                Don't just drift find your gravity. Join the students who are using FirstOrbit 
                to chart their course and land their dream internships. 
              </p>
            </div>

            {/* Right - Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Student-Led Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Student-Led</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Built by students who understand your needs</p>
              </div>

              {/* Multiple Domains Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">10+</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tech Domains</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Diverse opportunities across multiple fields</p>
              </div>

              {/* Success Stories Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">50+</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Success Stories</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Students who landed their dream roles</p>
              </div>

              {/* All Work Types Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All Work Types</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Remote, On-Site, Hybrid & Part-Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose FirstOrbit?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Students */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow border border-transparent dark:border-gray-700">
            <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
              For Students
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">✓</span>
                Browse thousands of internship opportunities
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">✓</span>
                Easy application process
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">✓</span>
                Track application status in real-time
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">✓</span>
                Filter by location, duration, and field
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow border border-transparent dark:border-gray-700">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
              For Companies
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                Post unlimited internship positions
              </li>
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                Manage applications efficiently
              </li>
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                Review and select top candidates
              </li>
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                Build your talent pipeline
              </li>
            </ul>
          </div>

          {/* Platform Benefits */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow border border-transparent dark:border-gray-700">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Platform Features
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-yellow-600 dark:text-yellow-400 mr-2">✓</span>
                User-friendly interface
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 dark:text-yellow-400 mr-2">✓</span>
                Secure authentication
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 dark:text-yellow-400 mr-2">✓</span>
                Real-time notifications
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 dark:text-yellow-400 mr-2">✓</span>
                Advanced search and filtering
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 dark:bg-indigo-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Liftoff? 🚀
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students and companies orbiting towards success with FirstOrbit
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 shadow-lg transition-transform hover:scale-105"
            >
              Launch Your Journey Today
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

