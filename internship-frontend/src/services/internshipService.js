import api from "./api";

const internshipService = {
  // Get all internships
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/internships${params ? `?${params}` : ""}`);
    return response.data;
  },

  // Get internship by ID
  getById: async (id) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },

  // Create new internship (Company/Admin)
  create: async (internshipData) => {
    const response = await api.post("/internships", internshipData);
    return response.data;
  },

  // Update internship (Company/Admin)
  update: async (id, internshipData) => {
    const response = await api.put(`/internships/${id}`, internshipData);
    return response.data;
  },

  // Delete internship (Company/Admin)
  delete: async (id) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
  },

  // Get my company's internships
  getMyInternships: async () => {
    const response = await api.get(`/internships/my`);
    return response.data;
  },

  // Get applicants for an internship (Company/Admin)
  getApplicants: async (internshipId) => {
    const response = await api.get(`/internships/${internshipId}/applicants`);
    return response.data;
  },
};

export default internshipService;
