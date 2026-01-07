import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import internshipService from "../services/internshipService";
import LoadingSpinner from "../components/LoadingSpinner";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [internships, setInternships] = useState([]);
  const [stats, setStats] = useState({
    totalInternships: 0,
    activeInternships: 0,
    totalApplicants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCompanyData = async () => {
    try {
      const data = await internshipService.getMyInternships();
      setInternships(data);

      setStats({
        totalInternships: data.length,
        activeInternships: data.filter((i) => i.status === "active").length,
        totalApplicants: data.reduce(
          (sum, i) => sum + (parseInt(i.application_count) || i.applicants?.length || 0),
          0
        ),
      });
    } catch (err) {
      setError("Failed to load company data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInternship = async (id) => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        await internshipService.delete(id);
        fetchCompanyData();
      } catch (err) {
        alert("Failed to delete internship");
      }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${textPrimary}`}>Company Dashboard</h1>
        <Link
          to="/company/internships/new"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Post New Internship
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className={`text-sm font-medium ${textMuted} truncate`}>
                  Total Postings
                </dt>
                <dd className={`text-2xl font-semibold ${textPrimary}`}>
                  {stats.totalInternships}
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
                  Active Internships
                </dt>
                <dd className={`text-2xl font-semibold ${textPrimary}`}>
                  {stats.activeInternships}
                </dd>
              </dl>
            </div>
          </div>
