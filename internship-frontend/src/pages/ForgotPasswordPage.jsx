import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';

const ForgotPasswordPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: success
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [demoCode, setDemoCode] = useState(''); // For demo purposes
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.forgotPassword(email);
      setDemoCode(response.demoCode || ''); // For demo - shows the code
      setStep(2);
      setMessage({ type: 'success', text: 'Reset code sent!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send reset code' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(email, resetCode, newPassword);
      setStep(3);
      setMessage({ type: 'success', text: 'Password reset successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md rounded-lg shadow-lg p-6 sm:p-8 ${cardBg}`}>
        <div className="text-center mb-6">
          <h1 className={`text-2xl font-bold ${textPrimary}`}>
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Reset Password'}
            {step === 3 && 'Success!'}
          </h1>
          <p className={`mt-2 text-sm ${textSecondary}`}>
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 2 && 'Enter the code and your new password'}
            {step === 3 && 'Your password has been reset'}
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>

            <p className={`text-center text-sm ${textSecondary}`}>
              Remember your password?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: Enter Code and New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Demo Code Display */}
            {demoCode && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                <strong>Demo Mode:</strong> Your reset code is <span className="font-mono font-bold">{demoCode}</span>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Reset Code</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 font-mono text-center text-lg tracking-widest ${inputBg}`}
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                placeholder="Enter new password"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                placeholder="Confirm new password"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className={`w-full py-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Back
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <p className={textSecondary}>
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Link
              to="/login"
              className="block w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
