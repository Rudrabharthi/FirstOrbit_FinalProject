import React, { useState, useEffect } from "react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTheme } from "../context/ThemeContext";

const CompanyManagementPage = () => {
  const { isDark } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", website: "" });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get("/companies");
      setCompanies(response.data);
    } catch (err) {
      setError("Failed to load companies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company? This will also delete all their internships.")) return;
    
    try {
      await api.delete(`/companies/${id}`);
      setCompanies(companies.filter(c => c.id !== id));
    } catch (err) {
      alert("Failed to delete company");
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setEditForm({
      name: company.name || "",
      description: company.description || "",
      website: company.website || ""
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/companies/${editingCompany.id}`, editForm);
      setCompanies(companies.map(c => 
        c.id === editingCompany.id ? { ...c, ...editForm } : c
      ));
      setEditingCompany(null);
    } catch (err) {
      alert("Failed to update company");
    }
  };

  const handleApproval = async (id, approved) => {
    try {
      await api.put(`/companies/${id}/approve`, { approved });
      setCompanies(companies.map(c => 
        c.id === id ? { ...c, is_approved: approved } : c
      ));
    } catch (err) {
      alert("Failed to update approval status");
    }
  };

  if (loading) return <LoadingSpinner />;

  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>Company Management</h1>
        <span className={`text-sm ${textSecondary}`}>
          {companies.length} companies registered
        </span>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {companies.map((company) => (
          <div key={company.id} className={`rounded-lg shadow-md overflow-hidden border ${cardBg}`}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                {editingCompany?.id === company.id ? (
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={`text-lg sm:text-xl font-bold border rounded px-2 py-1 w-full ${inputBg}`}
                  />
                ) : (
                  <h3 className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{company.name}</h3>
                )}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
                  company.is_approved 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}>
                  {company.is_approved ? "Approved" : "Pending"}
                </span>
              </div>

              <div className="mb-3">
                <p className={`text-xs sm:text-sm mb-1 ${textSecondary}`}>Email:</p>
