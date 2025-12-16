import api from './api';

const analyticsService = {
  // Get admin analytics
  getAdminAnalytics: async () => {
    const response = await api.get('/analytics/admin');
    return response.data;
  },

  // Get company analytics
  getCompanyAnalytics: async () => {
    const response = await api.get('/analytics/company');
    return response.data;
  },

  // Generate report
  generateReport: async (type) => {
    const response = await api.get(`/analytics/report?type=${type}`);
    return response.data;
  },
};

export default analyticsService;
