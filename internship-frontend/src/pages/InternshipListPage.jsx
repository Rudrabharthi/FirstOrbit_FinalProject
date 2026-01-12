import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import internshipService from "../services/internshipService";
import applicationService from "../services/applicationService";
import InternshipCard from "../components/InternshipCard";
import LoadingSpinner from "../components/LoadingSpinner";

const InternshipListPage = () => {
  const { isStudent } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, internships]);

  const fetchInternships = async () => {
    try {
      const data = await internshipService.getAll();
      setInternships(data);
      setFilteredInternships(data);
    } catch (err) {
      setError("Failed to load internships");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = [...internships];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (internship) =>
          internship.title
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          internship.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          (internship.company?.name || internship.companyName || "")
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((internship) =>
        internship.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(
        (internship) => internship.type === filters.type
      );
    }

    setFilteredInternships(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };



  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Available Internships
      </h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
