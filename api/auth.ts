import { api } from "./axios";

export const authApi = {

  signup: async (payload: any) => {
    try {

      const response = await api.post("/auth/register", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  login: async (payload: any) => {
    try {
      const response = await api.post("/auth/login", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  requestOtp: async (data: any) => {

    try {
      const response = await api.post("/auth/request-otp", data);
      return response.data;
    } catch (error: any) {
      throw error;
    }

  },


  verifyEmail: async (payload: any) => {
    try {
      const response = await api.post("/auth/verify-otp", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  resetPassword: async (data: any) => {
    try {
      const response = await api.post("/auth/reset-password", data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/auth/stats');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  ,

  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
};