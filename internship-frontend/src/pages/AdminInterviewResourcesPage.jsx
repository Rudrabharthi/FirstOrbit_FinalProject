import React, { useState, useEffect } from "react";
import interviewResourceService from "../services/interviewResourceService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTheme } from "../context/ThemeContext";

// Extract YouTube video ID from various URL formats
const extractVideoId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const AdminInterviewResourcesPage = () => {
  const { isDark } = useTheme();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    youtube_url: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await interviewResourceService.getAll();
      setResources(data);
    } catch (err) {
      setError("Failed to load interview resources");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.youtube_url || !form.title) {
      setError("YouTube URL and Title are required");
      return;
    }

    // Validate YouTube URL
    const videoId = extractVideoId(form.youtube_url);
    if (!videoId) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setSubmitting(true);
    try {
      await interviewResourceService.add(form);
      setSuccess("Video added successfully!");
      setForm({ youtube_url: "", title: "", description: "" });
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add video");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this video?")) return;

    try {
      await interviewResourceService.delete(id);
      setSuccess("Video removed successfully!");
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      setError("Failed to delete video");
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  const cardBg = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const inputBg = isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 ${textPrimary}`}>
        Manage Interview Resources
      </h1>
      <p className={`mb-6 sm:mb-8 ${textSecondary}`}>
        Add or remove YouTube interview preparation videos for students
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm sm:text-base">
          {success}
        </div>
      )}

      {/* Add Video Form */}
      <div className={`rounded-xl border shadow-md p-4 sm:p-6 mb-6 sm:mb-8 ${cardBg}`}>
        <h2 className={`text-lg sm:text-xl font-bold mb-4 ${textPrimary}`}>
          Add New Video
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
                YouTube URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="youtube_url"
                value={form.youtube_url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${inputBg}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Top 10 Interview Questions"
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${inputBg}`}
                required
              />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the video content..."
              rows="3"
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${inputBg}`}
            />
          </div>

          {/* Live Preview */}
          {form.youtube_url && extractVideoId(form.youtube_url) && (
            <div className={`rounded-lg border p-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-xs font-medium mb-2 ${textSecondary}`}>PREVIEW</p>
              <div className="flex gap-3 items-start">
                <img
                  src={`https://img.youtube.com/vi/${extractVideoId(form.youtube_url)}/mqdefault.jpg`}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded"
                />
                <div>
                  <p className={`font-medium text-sm ${textPrimary}`}>
                    {form.title || "Video Title"}
                  </p>
                  <p className={`text-xs mt-1 ${textSecondary}`}>
                    {form.description || "No description"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
          >
            {submitting ? "Adding..." : "Add Video"}
          </button>
        </form>
      </div>

      {/* Existing Resources */}
      <h2 className={`text-lg sm:text-xl font-bold mb-4 ${textPrimary}`}>
        Existing Videos ({resources.length})
      </h2>

      {resources.length === 0 ? (
        <div className={`text-center py-12 rounded-lg border ${cardBg}`}>
          <svg className={`mx-auto h-12 w-12 mb-3 ${textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className={textSecondary}>No videos added yet. Use the form above to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {resources.map((resource) => {
            const videoId = extractVideoId(resource.youtube_url);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : null;

            return (
              <div
                key={resource.id}
                className={`rounded-xl border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${cardBg}`}
              >
                {/* Thumbnail */}
                <a
                  href={resource.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={resource.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className={`w-full h-44 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <svg className={`h-12 w-12 ${textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-14 h-14 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </a>

                {/* Content */}
                <div className="p-4">
                  <h3 className={`font-semibold text-sm sm:text-base mb-1 line-clamp-2 ${textPrimary}`}>
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className={`text-xs sm:text-sm mb-3 line-clamp-2 ${textSecondary}`}>
                      {resource.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <a
                      href={resource.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
                    >
                      Watch on YouTube →
                    </a>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      title="Remove this video"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminInterviewResourcesPage;
