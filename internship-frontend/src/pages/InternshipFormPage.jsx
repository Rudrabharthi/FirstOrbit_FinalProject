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
            id="description"
            rows="5"
            {...register("description", {
              required: "Description is required",
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
            placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="required_skills"
            className={`block text-sm font-medium ${textSecondary} mb-1`}
          >
            Required Skills *
          </label>
          <textarea
            id="required_skills"
            rows="4"
            {...register("required_skills", {
              required: "Required skills are required",
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
            placeholder="List the required skills, qualifications, and experience..."
          />
          {errors.required_skills && (
            <p className="mt-1 text-sm text-red-600">
              {errors.required_skills.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="location"
              className={`block text-sm font-medium ${textSecondary} mb-1`}
            >
              Location *
            </label>
            <select
              id="location"
              {...register("location", { required: "Location is required" })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
            >
              <option value="">Select location type</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="duration"
              className={`block text-sm font-medium ${textSecondary} mb-1`}
            >
              Duration *
            </label>
            <input
              id="duration"
              type="text"
              {...register("duration", { required: "Duration is required" })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
              placeholder="e.g., 3 months, 6 months"
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">
                {errors.duration.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="stipend_type"
              className={`block text-sm font-medium ${textSecondary} mb-1`}
            >
              Stipend Type
            </label>
            <select
              id="stipend_type"
              {...register("stipend_type")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Negotiable">Negotiable</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="stipend_amount"
              className={`block text-sm font-medium ${textSecondary} mb-1`}
            >
              Stipend Amount (per month)
            </label>
            <input
              id="stipend_amount"
              type="text"
              inputMode="numeric"
              {...register("stipend_amount", { 
                pattern: { value: /^\d+$/, message: "Please enter a valid positive number" } 
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
              placeholder="e.g., 10000"
            />
            {errors.stipend_amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stipend_amount.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="deadline"
              className={`block text-sm font-medium ${textSecondary} mb-1`}
            >
              Application Deadline
            </label>
            <input
              id="deadline"
              type="date"
              {...register("deadline")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
            />
          </div>

          <div>
            <label
              htmlFor="openings"
              className={`block text-sm font-medium ${textSecondary} mb-1`}
            >
              Number of Openings
            </label>
            <input
              id="openings"
              type="text"
              inputMode="numeric"
              defaultValue="1"
              {...register("openings", { 
                required: "Number of openings is required",
                pattern: { value: /^[1-9]\d*$/, message: "Please enter a valid number (at least 1)" } 
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
              placeholder="e.g., 5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="eligibility_cgpa"
              className={`block text-sm font-medium ${textSecondary} mb-1`}
            >
              Minimum CGPA (optional)
            </label>
            <input
              id="eligibility_cgpa"
              type="number"
              step="0.1"
              {...register("eligibility_cgpa")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
              placeholder="e.g., 7.0"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className={`block text-sm font-medium ${textSecondary} mb-1`}
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="eligible_departments"
            className={`block text-sm font-medium ${textSecondary} mb-1`}
          >
            Eligible Departments (optional)
          </label>
          <input
            id="eligible_departments"
            type="text"
            {...register("eligible_departments")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${inputClass}`}
            placeholder="e.g., Computer Science, IT, Electronics"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`px-6 py-2 border rounded-md ${buttonSecondary}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Internship"
              : "Post Internship"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternshipFormPage;
