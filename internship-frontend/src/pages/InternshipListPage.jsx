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
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:border dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-semibold dark:text-white mb-4">Search & Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Search
            </label>
            <input
              id="search"
              name="search"
              type="text"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search by title, company, or keyword..."
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Filter by location..."
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setFilters({ search: "", location: "", type: "" })}
          className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Clear All Filters
        </button>
      </div>

      {/* Results */}
      <div className="mb-4 text-gray-600 dark:text-gray-400">
        Showing {filteredInternships.length} of {internships.length} internships
      </div>

      {filteredInternships.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:border dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No internships found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship._id || internship.id}
              internship={internship}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipListPage;
