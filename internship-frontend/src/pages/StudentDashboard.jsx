import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import applicationService from "../services/applicationService";
import internshipService from "../services/internshipService";
import LoadingSpinner from "../components/LoadingSpinner";
import InternshipCard from "../components/InternshipCard";

const StudentDashboard = () => {
  const { isDark } = useTheme();
  const [applications, setApplications] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const [myApplications, allInternships] = await Promise.all([
        applicationService.getMyApplications(),
        internshipService.getAll(),
      ]);

      setApplications(myApplications);

      // Calculate stats
      const statusCounts = myApplications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalApplications: myApplications.length,
        pending: statusCounts.pending || 0,
        accepted: statusCounts.accepted || 0,
        rejected: statusCounts.rejected || 0,
      });

      // Get recommended internships (not already applied)
      const appliedIds = myApplications.map(
        (app) => app.internship_id || app.internship?._id || app.internshipId
      );
      const recommended = allInternships
        .filter(
          (internship) => !appliedIds.includes(internship._id || internship.id)
        )
        .slice(0, 3);
      setRecommendedInternships(recommended);
    } catch (err) {
      setError("Failed to load student data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Theme classes
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const tableBg = isDark ? 'bg-gray-700' : 'bg-gray-50';
  const tableDivide = isDark ? 'divide-gray-600' : 'divide-gray-200';
  const tableRowBg = isDark ? 'bg-gray-800' : 'bg-white';

  if (loading) return <LoadingSpinner />;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <h1 className={`text-3xl font-bold ${textPrimary} mb-8`}>
        Student Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${cardBg} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className={`text-sm font-medium ${textMuted} truncate`}>
                  Total Applications
                </dt>
                <dd className={`text-2xl font-semibold ${textPrimary}`}>
                  {stats.totalApplications}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className={`text-sm font-medium ${textMuted} truncate`}>
                  Pending
                </dt>
                <dd className={`text-2xl font-semibold ${textPrimary}`}>
                  {stats.pending}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className={`text-sm font-medium ${textMuted} truncate`}>
