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

  getActive: async () => {
    try {
      const response = await api.get("/escrow?preset=active");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getDisputed: async () => {
    try {
      const response = await api.get("/escrow?preset=disputed");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getCompleted: async () => {
    try {
      const response = await api.get("/escrow?preset=completed");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  deliver: async (escrowId: string, proofFile: File) => {
    try {
      const formData = new FormData();
      formData.append("proof", proofFile);
      const response = await api.post(`/escrow/${escrowId}/deliver`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  nudge: async (escrowId: string) => {
    try {
      const response = await api.post(`/escrow/${escrowId}/nudge`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
