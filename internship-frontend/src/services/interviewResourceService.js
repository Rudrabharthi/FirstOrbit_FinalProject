import api from './api';

const interviewResourceService = {
  // Get all interview resources
  getAll: async () => {
    const response = await api.get('/interview-resources');
    return response.data;
  },

  // Add a new interview resource (admin only)
  add: async (data) => {
    const response = await api.post('/interview-resources', data);
    return response.data;
  },

  // Delete an interview resource (admin only)
  delete: async (id) => {
    const response = await api.delete(`/interview-resources/${id}`);
    return response.data;
  },
};

export default interviewResourceService;
