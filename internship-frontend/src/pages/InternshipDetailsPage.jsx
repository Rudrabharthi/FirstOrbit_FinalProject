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
