import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    department: '',
    skills: '',
    companyName: '',
    companyDescription: '',
    website: ''
  });
  
  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { user: userData } = await authService.getProfile();
      const profile = userData.profile || {};
      
      setProfileForm({
        name: profile.name || '',
        phone: profile.phone || '',
        department: profile.department || '',
        skills: profile.skills || '',
        companyName: profile.name || '',
        companyDescription: profile.description || '',
        website: profile.website || ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.updateProfile(profileForm);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh profile data
      fetchProfile();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setSaving(false);
      return;
    }

    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const tabActive = 'bg-indigo-600 text-white';
  const tabInactive = isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-6 ${textPrimary}`}>
        My Profile
      </h1>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? tabActive : tabInactive}`}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'password' ? tabActive : tabInactive}`}
        >
          Change Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className={`rounded-lg shadow-md p-6 ${cardBg}`}>
          <h2 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Profile Information</h2>
          
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className={`w-full px-4 py-2 rounded-lg border opacity-60 cursor-not-allowed ${inputBg}`}
              />
              <p className={`text-xs mt-1 ${textSecondary}`}>Email cannot be changed</p>
            </div>

            {/* Role (read-only) */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Role</label>
              <input
                type="text"
                value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ''}
                disabled
                className={`w-full px-4 py-2 rounded-lg border opacity-60 cursor-not-allowed ${inputBg}`}
              />
            </div>

            {/* Student/Company specific fields */}
            {user?.role === 'student' && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Department / Branch</label>
                  <input
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                    placeholder="e.g., Computer Science, Electronics"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Skills</label>
                  <textarea
                    value={profileForm.skills}
                    onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                    rows={3}
                    placeholder="e.g., JavaScript, React, Python"
                  />
                </div>
              </>
            )}

            {user?.role === 'company' && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Company Name</label>
                  <input
                    type="text"
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Description</label>
                  <textarea
                    value={profileForm.companyDescription}
                    onChange={(e) => setProfileForm({ ...profileForm, companyDescription: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                    rows={3}
                    placeholder="Describe your company"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Website</label>
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                    placeholder="https://example.com"
                  />
                </div>
              </>
            )}

            {user?.role === 'admin' && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                  placeholder="Enter your name"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className={`rounded-lg shadow-md p-6 ${cardBg}`}>
          <h2 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Change Password</h2>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                minLength={6}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
