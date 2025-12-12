import api from "./api";

const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Register user
  signup: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },

  // Change password (authenticated)
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  },

  // Forgot password - request reset code
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password with code
  resetPassword: async (email, code, newPassword) => {
    const response = await api.post("/auth/reset-password", { email, code, newPassword });
    return response.data;
  },
};

export default authService;
