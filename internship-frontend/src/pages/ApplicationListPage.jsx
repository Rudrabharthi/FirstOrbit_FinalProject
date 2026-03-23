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
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen`}>
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
          <p className={`${textSecondary} text-lg mb-4`}>
            {filter === "all"
              ? "You haven't applied to any internships yet."
              : `No ${filter} applications.`}
          </p>
          <Link
            to="/internships"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Browse Internships
          </Link>
        </div>
      ) : (
        <div className={`${cardBg} rounded-lg shadow overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${tableDivide}`}>
              <thead className={tableHeadBg}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                    Internship
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                    Company
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                    Location
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                    Applied On
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${cardBg} divide-y ${tableDivide}`}>
                {filteredApplications.map((application) => (
                  <tr
                    key={application._id || application.id}
                    className={hoverBg}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${textPrimary}`}>
                        {application.internship_title || application.internship?.title || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${textSecondary}`}>
                        {application.company_name ||
                          application.internship?.company?.name ||
                          "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${textSecondary}`}>
                        {application.location || application.internship?.location || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${textSecondary}`}>
                        {new Date(application.applied_at || application.createdAt).toLocaleDateString()}
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/internships/${
                          application.internship_id || application.internship?._id
                        }`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        View Internship
                      </Link>
                      {application.status === "pending" && (
                        <button
                          onClick={() =>
                            handleWithdraw(application._id || application.id)
                          }
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationListPage;
