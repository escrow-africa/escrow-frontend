import { api } from "./axios";

export const escrowApi = {
  create: async (payload: any) => {
    try {
      const response = await api.post("/escrow/create", payload);
      return response.data;
    } catch (error: any) {
      console.log("escrow.create error", error);
      throw error;
    }
  },

  getById: async (escrowId: string) => {
    try {
      const response = await api.get(`/escrow/${escrowId}`);
      return response.data;
    } catch (error: any) {
      console.log("escrow.getById error", error);
      throw error;
    }
  },

  getStats: async (escrowId?: string) => {
    try {
      const url = escrowId ? `/escrow/stats?escrowId=${encodeURIComponent(escrowId)}` : "/escrow/stats";
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.log("escrow.getStats error", error);
      throw error;
    }
  },

  getActive: async () => {
    try {
      const response = await api.get("/escrow/active");
      return response.data;
    } catch (error: any) {
      console.log("escrow.getActive error", error);
      throw error;
    }
  },

  getDisputed: async () => {
    try {
      const response = await api.get("/escrow/disputed");
      return response.data;
    } catch (error: any) {
      console.log("escrow.getDisputed error", error);
      throw error;
    }
  },

  getCompleted: async () => {
    try {
      const response = await api.get("/escrow/completed");
      return response.data;
    } catch (error: any) {
      console.log("escrow.getCompleted error", error);
      throw error;
    }
  },
};
