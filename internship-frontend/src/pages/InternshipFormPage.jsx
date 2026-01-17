import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import internshipService from "../services/internshipService";
import LoadingSpinner from "../components/LoadingSpinner";

const InternshipFormPage = () => {
  const { id } = useParams();
  const { isCompany, isAdmin } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [error, setError] = useState("");
  const isEditMode = !!id;

  useEffect(() => {
    if (id) {
      fetchInternship();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInternship = async () => {
    try {
      const data = await internshipService.getById(id);

      // Populate form fields
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    } catch (err) {
      setError("Failed to load internship data");
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        await internshipService.update(id, data);
      } else {
        await internshipService.create(data);
      }

      // Redirect based on role
      if (isAdmin) {
        navigate("/admin/internships");
      } else if (isCompany) {
        navigate("/company/internships");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} internship`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  // Theme classes
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const inputClass = isDark 
    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
    : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500';
  const buttonSecondary = isDark 
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
    : 'border-gray-300 text-gray-700 hover:bg-gray-50';

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <h1 className={`text-3xl font-bold ${textPrimary} mb-8`}>
        {isEditMode ? "Edit Internship" : "Post New Internship"}
      </h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${cardBg} shadow rounded-lg p-8 space-y-6`}
      >
        <div>
          <label
            htmlFor="title"
            className={`block text-sm font-medium ${textSecondary} mb-1`}
          >
            Job Title *
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Job title is required" })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
            placeholder="e.g., Software Development Intern"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className={`block text-sm font-medium ${textSecondary} mb-1`}
          >
            Description *
          </label>
          <textarea
