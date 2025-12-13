import api from "./api";

const applicationService = {
  // Apply for internship (Student)
  apply: async (applicationData) => {
    const config = {};
    if (applicationData instanceof FormData) {
      config.headers = { "Content-Type": "multipart/form-data" };
    }
    const response = await api.post("/applications", applicationData, config);
    return response.data;
  },

  // Get all applications for current user
  getMyApplications: async () => {
    const response = await api.get("/applications/my");
    return response.data;
  },

  // Get application by ID
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Update application status (Company/Admin)
  updateStatus: async (id, status) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  },

  // Withdraw application (Student)
  withdraw: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  // Get all applications (Admin only)
  getAll: async () => {
    const response = await api.get("/applications");
    return response.data;
  },
};

export default applicationService;
