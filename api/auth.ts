import { api } from "./axios";

export const authApi = {

  signup: async (payload: any) => {
    try {

      const response = await api.post("/auth/register", payload);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  },

  login: async (payload: any) => {

    try {
      const response = await api.post("/auth/login", payload);
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  },
  requestOtp: async (data: any) => {

    try {
      const response = await api.post("/auth/request-otp", data);
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw error;
    }

  },


  verifyPassword: async (payload: any) => {
    try {
      const response = await api.post("/auth/verify-otp", payload);
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  },

  resetPassword: async (data: any) => {

    try {
      const response = await api.post("/auth/reset-password", data);
      return response.data;
    } catch (error: any) {
      console.log(error);
    }

  }
  ,

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      console.log("logout error", error);
      throw error;
    }
  }
};