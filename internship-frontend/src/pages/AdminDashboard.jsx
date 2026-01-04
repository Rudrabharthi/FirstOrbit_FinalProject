import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import analyticsService from "../services/analyticsService";
import internshipService from "../services/internshipService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTheme } from "../context/ThemeContext";

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    totalInternships: 0,
    totalCompanies: 0,
    totalStudents: 0,
    totalApplications: 0,
    placementRate: 0,
  });
  const [recentInternships, setRecentInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const analytics = await analyticsService.getAdminAnalytics();
      
      setStats({
        totalInternships: analytics.totalInternships || 0,
        totalCompanies: analytics.totalCompanies || 0,
        totalStudents: analytics.totalStudents || 0,
        totalApplications: analytics.totalApplications || 0,
        placementRate: analytics.placementRate || 0,
      });

      setRecentInternships(analytics.recentInternships || []);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInternship = async (id) => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        await internshipService.delete(id);
        fetchDashboardData();
      } catch (err) {
        alert("Failed to delete internship");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 ${textPrimary}`}>
        Admin Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {/* Total Internships */}
        <div className={`rounded-lg shadow p-3 sm:p-4 lg:p-6 ${cardBg}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2 sm:p-3">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-5 w-0 flex-1">
