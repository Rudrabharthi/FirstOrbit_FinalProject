import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const InternshipCard = ({
  internship,
  onApply,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const { isStudent, isCompany, isAdmin } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow dark:border dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {internship.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {internship.company_name || internship.company?.name || internship.companyName}
          </p>
        </div>
        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
          {internship.stipend_type || internship.type || "Full-time"}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{internship.location}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{internship.duration}</span>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {internship.description}
      </p>

      {(internship.required_skills || internship.requirements) && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Requirements:</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {internship.required_skills || internship.requirements}
          </p>
        </div>
      )}

      {(internship.stipend_amount || internship.stipend) && (
        <div className="mb-4">
          <span className="text-green-600 font-semibold">
            Stipend: ₹{internship.stipend_amount || internship.stipend}/month
          </span>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 mt-4">
          <Link
            to={`/internships/${internship._id || internship.id}`}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-center"
          >
            View Details
          </Link>



          {(isCompany || isAdmin) && onEdit && (
            <button
              onClick={() => onEdit(internship)}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Edit
            </button>
          )}

          {(isCompany || isAdmin) && onDelete && (
            <button
              onClick={() => onDelete(internship)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InternshipCard;
