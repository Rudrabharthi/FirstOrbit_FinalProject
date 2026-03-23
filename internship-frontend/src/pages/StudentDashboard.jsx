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
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen`}>
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
                  Accepted
                </dt>
                <dd className={`text-2xl font-semibold ${textPrimary}`}>
                  {stats.accepted}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className={`text-sm font-medium ${textMuted} truncate`}>
                  Rejected
                </dt>
                <dd className={`text-2xl font-semibold ${textPrimary}`}>
                  {stats.rejected}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${cardBg} rounded-lg shadow p-6 mb-8`}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/internships"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 text-center"
          >
            Browse All Internships
          </Link>
          <Link
            to="/student/applications"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-center"
          >
            View My Applications
          </Link>
        </div>
      </div>

      {/* Recommended Internships */}
      {recommendedInternships.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${textPrimary}`}>Recommended Internships</h2>
            <Link
              to="/internships"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedInternships.map((internship) => (
              <InternshipCard
                key={internship._id || internship.id}
                internship={internship}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className={`${cardBg} rounded-lg shadow p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${textPrimary}`}>Recent Applications</h2>
          <Link
            to="/student/applications"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            View All
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${textMuted} mb-4`}>
              You haven't applied to any internships yet.
            </p>
            <Link
              to="/internships"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Browse Internships
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${tableDivide}`}>
              <thead className={tableBg}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Internship
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Company
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Applied On
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={`${tableRowBg} divide-y ${tableDivide}`}>
                {applications.slice(0, 5).map((application) => (
                  <tr key={application._id || application.id}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${textPrimary}`}>
                      {application.internship_title || application.internship?.title || "N/A"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMuted}`}>
                      {application.company_name || application.internship?.company?.name ||
                        application.internship?.companyName ||
                        "N/A"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMuted}`}>
                      {new Date(application.applied_at || application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === "accepted"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
