import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import internshipService from "../services/internshipService";
import applicationService from "../services/applicationService";
import LoadingSpinner from "../components/LoadingSpinner";

const ApplicantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [internship, setInternship] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      const [internshipData, applicantsData] = await Promise.all([
        internshipService.getById(id),
        internshipService.getApplicants(id),
      ]);
      setInternship(internshipData);
      setApplicants(applicantsData);
    } catch (err) {
      setError("Failed to load applicants");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await applicationService.updateStatus(applicationId, status);
      fetchData();
      alert(`Application ${status} successfully!`);
    } catch (err) {
      alert("Failed to update application status");
    }
  };

  // Helper to get resume URL
  const getResumeUrl = (path) => {
    if (!path) return null;
    const baseUrl = "http://localhost:5000"; // Should come from env in prod
    return `${baseUrl}/${path}`;
  };

  // Theme classes
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const tableBg = isDark ? 'bg-gray-700' : 'bg-gray-50';
  const tableDivide = isDark ? 'divide-gray-600' : 'divide-gray-200';
  const tableRowBg = isDark ? 'bg-gray-800' : 'bg-white';
  const tableHover = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  if (loading) return <LoadingSpinner />;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`mb-6 flex items-center ${textMuted} hover:${textPrimary}`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Internship Info */}
      {internship && (
        <div className={`${cardBg} rounded-lg shadow p-6 mb-8`}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                {internship.title}
              </h1>
              <p className={textSecondary}>
                📍 {internship.location} • ⏱️ {internship.duration}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              internship.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}>
              {internship.status}
            </span>
          </div>
        </div>
      )}

      {/* Applicants List */}
      <div className={`${cardBg} rounded-lg shadow`}>
        <div className={`px-6 py-4 border-b ${borderColor}`}>
          <h2 className={`text-xl font-bold ${textPrimary}`}>
            Applicants ({applicants.length})
          </h2>
        </div>

        {applicants.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className={textMuted}>No applications received yet for this internship.</p>
            <p className={`${textMuted} text-sm mt-2`}>Applications will appear here when students apply.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${tableDivide}`}>
              <thead className={tableBg}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Student Name
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Resume
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Email
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Department
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Phone
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Applied On
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${tableRowBg} divide-y ${tableDivide}`}>
                {applicants.map((applicant) => (
                  <tr
                    key={applicant._id || applicant.id}
                    className={tableHover}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${textPrimary}`}>
                        {applicant.name || applicant.student?.name || applicant.studentName || "N/A"}
                      </div>
                      {applicant.skills && (
                        <div className={`text-xs ${textMuted} mt-1`}>
                          Skills: {applicant.skills}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(applicant.resume_path || applicant.student?.resume_path) ? (
                        <a 
                          href={getResumeUrl(applicant.resume_path || applicant.student?.resume_path)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          View Resume
                        </a>
                      ) : (
                        <span className={`text-sm ${textMuted} italic`}>No Resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${textMuted}`}>
                        {applicant.email || applicant.student?.email || applicant.studentEmail || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${textMuted}`}>
                        {applicant.department || applicant.student?.department || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${textMuted}`}>
                        {applicant.phone || applicant.student?.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${textMuted}`}>
                        {new Date(applicant.applied_at || applicant.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          applicant.status === "accepted"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : applicant.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {applicant.status === "pending" ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                applicant._id || applicant.id,
                                "accepted"
                              )
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                applicant._id || applicant.id,
                                "rejected"
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      ) : (
                        <span className={textMuted}>—</span>
                      )}
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

export default ApplicantsPage;
