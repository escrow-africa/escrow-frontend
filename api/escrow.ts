import { api } from "./axios";

export const escrowApi = {
  create: async (payload: any) => {
    try {
      const response = await api.post("/escrow/create", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getById: async (escrowId: string) => {
    try {
      const response = await api.get(`/escrow/${escrowId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getStats: async () => {
    try {
      const url = "/escrow/stats";
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getActive: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/escrow?preset=active&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getDisputed: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/escrow?preset=disputed&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getCompleted: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/escrow?preset=completed&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  deliver: async (escrowId: string, proofFile: File) => {
    try {
      const formData = new FormData();
      formData.append("proof", proofFile);
      // Don't set Content-Type here - the axios request interceptor strips the client's
      // default application/json header for FormData bodies so the browser can set its own
      // multipart boundary. A manual "multipart/form-data" override here (missing the
      // boundary param) would be just as broken as the JSON default it's meant to avoid.
      const response = await api.post(`/escrow/${escrowId}/deliver`, formData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  nudge: async (escrowId: string) => {
    try {
      const response = await api.post(`/escrow/${escrowId}/nudge`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  extend: async (escrowId: string, deliveryDeadline: string) => {
    try {
      const response = await api.post(`/escrow/${escrowId}/extend`, { deliveryDeadline });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  cancel: async (escrowId: string, reason?: string) => {
    try {
      const response = await api.post(`/escrow/${escrowId}/cancel`, { reason });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  fund: async (escrowId: string) => {
    try {
      const response = await api.post(`/escrow/${escrowId}/fund`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  complete: async (escrowId: string) => {
    try {
      const response = await api.post(`/escrow/${escrowId}/complete`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
