import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import internshipService from "../services/internshipService";
import applicationService from "../services/applicationService";
import LoadingSpinner from "../components/LoadingSpinner";

const InternshipDetailsPage = () => {
  const { id } = useParams();
  const { isStudent, isCompany, isAdmin } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchInternship();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInternship = async () => {
    try {
      const data = await internshipService.getById(id);
      setInternship(data);
    } catch (err) {
      setError("Failed to load internship details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExt)) {
        alert("Invalid file type. Please upload PDF, DOC, or DOCX.");
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert("File size exceeds 10MB limit.");
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleApply = async () => {
    if (!selectedFile) {
        alert("Please upload a resume (PDF, DOC, DOCX) to apply.");
        return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('internship_id', id);
      formData.append('resume', selectedFile);

      await applicationService.apply(formData);
      alert("Application submitted successfully!");
      navigate("/student/applications");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        await internshipService.delete(id);
        alert("Internship deleted successfully");
        if (isAdmin) {
          navigate("/admin/internships");
        } else if (isCompany) {
          navigate("/company/internships");
        }
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
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  if (loading) return <LoadingSpinner />;

  if (error || !internship) {
    return (
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error || "Internship not found"}
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${cardBg} rounded-lg shadow-lg overflow-hidden`}>
        {/* Header */}
        <div className="bg-indigo-600 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {internship.title}
              </h1>
              <p className="text-indigo-100 text-lg">
                {internship.company_name || internship.company?.name || internship.companyName}
              </p>
            </div>
            <span className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
              {internship.stipend_type || internship.type || "Full-time"}
            </span>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`flex items-center ${textSecondary}`}>
              <svg
                className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className={`text-sm ${textMuted}`}>Location</p>
                <p className={`font-semibold ${textPrimary}`}>{internship.location}</p>
              </div>
            </div>

            <div className={`flex items-center ${textSecondary}`}>
              <svg
                className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400"
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
              <div>
                <p className={`text-sm ${textMuted}`}>Duration</p>
                <p className={`font-semibold ${textPrimary}`}>{internship.duration}</p>
              </div>
            </div>

            {(internship.stipend_amount || internship.stipend) && (
              <div className={`flex items-center ${textSecondary}`}>
                <svg
                  className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className={`text-sm ${textMuted}`}>Stipend</p>
                  <p className={`font-semibold ${textPrimary}`}>₹{internship.stipend_amount || internship.stipend}/month</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className={`text-xl font-bold ${textPrimary} mb-3`}>
              About the Internship
            </h2>
            <p className={`${textSecondary} whitespace-pre-line leading-relaxed`}>
              {internship.description}
            </p>
          </div>

          {/* Requirements */}
          {(internship.required_skills || internship.requirements) && (
            <div>
              <h2 className={`text-xl font-bold ${textPrimary} mb-3`}>
                Requirements
              </h2>
              <p className={`${textSecondary} whitespace-pre-line`}>
