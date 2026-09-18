import { api } from "./axios";
import type SignUpData from "@/components/Interface";

export const authApi = {

  signup: async (payload: SignUpData) => {
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
  },

  // Browser Sessions
  getSessions: async () => {
    try {
      const response = await api.get("/auth/sessions");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  revokeOtherSessions: async () => {
    try {
      const response = await api.post("/auth/sessions/revoke-others");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  revokeSession: async (sessionId: string) => {
    try {
      const response = await api.delete(`/auth/sessions/${sessionId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

export interface SessionItem {
  id?: string;
  _id?: string;
  sessionId?: string;
  ipAddress?: string;
  ip?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  country?: string;
  city?: string;
  lastActive?: string;
  lastActiveAt?: string;
  updatedAt?: string;
  createdAt?: string;
  isCurrent?: boolean;
  current?: boolean;
}

export const sessionApi = {
  getSessions: authApi.getSessions,
  revokeOtherSessions: authApi.revokeOtherSessions,
  revokeSession: authApi.revokeSession,
};