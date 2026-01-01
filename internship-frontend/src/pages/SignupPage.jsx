import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await authService.signup(data);
      
      // For companies, show pending approval message instead of auto-login
      if (data.role === "company") {
        setRegistrationSuccess(true);
        return; // Don't auto-login
      }
      
      // For students, auto-login as before
      login(response.user, response.token);

      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/admin");
      } else if (response.user.role === "student") {
        navigate("/student");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {registrationSuccess ? 'Registration Successful!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {registrationSuccess ? 'Your company account is pending approval' : 'Join FirstOrbit'}
          </p>
        </div>

        {/* Company Registration Success Message */}
        {registrationSuccess ? (
          <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg shadow-lg dark:border dark:border-gray-600 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Almost There!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for registering your company with FirstOrbit! Your account is currently 
              <span className="font-semibold text-yellow-600 dark:text-yellow-400"> pending approval</span>.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our admin team will review your application and approve your account shortly. 
              Once approved, you'll be able to log in and start posting internships.
            </p>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300 px-4 py-3 rounded-lg text-sm mb-6">
              <strong>Note:</strong> You will receive a notification once your account is approved.
            </div>
            <Link
              to="/login"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Go to Login Page
            </Link>
          </div>
        ) : (
        <form
          className="mt-8 space-y-6 bg-lavender dark:bg-gray-800 p-8 rounded-lg shadow dark:border dark:border-gray-700"
          onSubmit={handleSubmit(onSubmit)}
        >
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
