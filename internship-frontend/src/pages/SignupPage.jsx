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
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                I am a
              </label>
              <select
                id="role"
                {...register("role", { required: "Role is required" })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="company">Company</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Company Name - Only shown when role is company */}
            {watch("role") === "company" && (
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  {...register("companyName", {
                    required: watch("role") === "company" ? "Company name is required" : false,
                  })}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your company name"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
              <div className="mt-2 flex items-center">
                <input
                  id="showPassword"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="showPassword"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Show Password
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
