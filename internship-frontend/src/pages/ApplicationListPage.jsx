import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import applicationService from "../services/applicationService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTheme } from "../context/ThemeContext";

const ApplicationListPage = () => {
  const { isDark } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err) {
      setError("Failed to load applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        await applicationService.withdraw(id);
        fetchApplications();
      } catch (err) {
        alert("Failed to withdraw application");
      }
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  // Theme classes
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderCol = isDark ? 'border-gray-700' : 'border-gray-200';
  const tableHeadBg = isDark ? 'bg-gray-700' : 'bg-gray-50';
  const tableDivide = isDark ? 'divide-gray-700' : 'divide-gray-200';
  const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  if (loading) return <LoadingSpinner />;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${textPrimary}`}>My Applications</h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className={`${cardBg} rounded-lg shadow mb-6`}>
        <div className={`border-b ${borderCol}`}>
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setFilter("all")}
              className={`${
                filter === "all"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : `border-transparent ${textSecondary} hover:${textPrimary} hover:border-gray-300`
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`${
                filter === "pending"
                  ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                  : `border-transparent ${textSecondary} hover:${textPrimary} hover:border-gray-300`
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending (
              {applications.filter((a) => a.status === "pending").length})
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className={`${
                filter === "accepted"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : `border-transparent ${textSecondary} hover:${textPrimary} hover:border-gray-300`
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Accepted (
              {applications.filter((a) => a.status === "accepted").length})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`${
                filter === "rejected"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : `border-transparent ${textSecondary} hover:${textPrimary} hover:border-gray-300`
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Rejected (
              {applications.filter((a) => a.status === "rejected").length})
            </button>
          </nav>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className={`${cardBg} rounded-lg shadow p-12 text-center`}>
