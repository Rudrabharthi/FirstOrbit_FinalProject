import api from "./api";

const userService = {
  // Get all users (Admin only)
  getAll: async (role = null) => {
    const response = await api.get(`/users${role ? `?role=${role}` : ""}`);
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user (Admin)
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (Admin)
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get all companies
  getCompanies: async () => {
    const response = await api.get("/users/companies");
    return response.data;
  },

  // Get all students
  getStudents: async () => {
    const response = await api.get("/users/students");
    return response.data;
  },

  // Approve or reject company (Admin)
  approveCompany: async (companyId, approved) => {
    const response = await api.put(`/companies/${companyId}/approve`, { approved });
    return response.data;
  },
};

export default userService;
