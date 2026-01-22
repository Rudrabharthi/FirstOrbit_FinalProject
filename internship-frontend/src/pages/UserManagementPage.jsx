import React, { useState, useEffect } from "react";
import userService from "../services/userService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTheme } from "../context/ThemeContext";

const UserManagementPage = () => {
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const role = filter === "all" ? null : filter;
      const data = await userService.getAll(role);
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await userService.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name || "", email: user.email });
  };

  const handleSave = async () => {
    try {
      await userService.update(editingUser.id, editForm);
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...editForm } : u
      ));
      setEditingUser(null);
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleApprove = async (user, approved) => {
    if (!user.company_id) {
      alert("Company data not found");
      return;
    }
    
    try {
      await userService.approveCompany(user.company_id, approved);
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, is_approved: approved } : u
      ));
      alert(`Company ${approved ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      alert("Failed to update company status");
      console.error(err);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      company: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      student: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <LoadingSpinner />;

  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>User Management</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <label className={`text-sm ${textSecondary}`}>Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`border rounded-md px-3 py-2 text-sm ${inputBg}`}
          >
            <option value="all">All Users</option>
            <option value="admin">Admins</option>
            <option value="company">Companies</option>
            <option value="student">Students</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className={`${cardBg} shadow-md rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${borderColor}`}>
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                  ID
                </th>
                <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                  Name
