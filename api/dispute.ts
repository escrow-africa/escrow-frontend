import { api } from "./axios";
import { CreateDisputePayload, Dispute, DisputeCard, DisputeMessageRecord } from "../types/disputes";

export const disputeApi = {
  create: async (payload: FormData | CreateDisputePayload) => {
    try {
      const response = await api.post("/disputes", payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  getMine: async (page = 1, limit = 20) => {
    try {
      const response = await api.get<DisputeCard[]>(`/disputes/me?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  getById: async (disputeId: string) => {
    try {
      const response = await api.get<Dispute>(`/disputes/${disputeId}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  getMessages: async (disputeId: string, page = 1, limit = 30) => {
    try {
      const response = await api.get<DisputeMessageRecord[]>(`/disputes/${disputeId}/messages?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  sendMessage: async (disputeId: string, message: string) => {
    try {
      const response = await api.post(`/disputes/${disputeId}/message`, { message });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  requestReview: async (disputeId: string, reason?: string) => {
    try {
      const response = await api.post(`/disputes/${disputeId}/request-review`, { reason });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  getEvents: async (disputeId: string, page = 1, limit = 100) => {
    try {
      const response = await api.get(`/disputes/${disputeId}/events?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  proposeSettlement: async (disputeId: string) => {
    try {
      const response = await api.post(`/disputes/${disputeId}/propose-settlement`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  acceptSettlement: async (disputeId: string, eventId: string) => {
    try {
      const response = await api.post(`/disputes/${disputeId}/settlement/${eventId}/accept`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  declineSettlement: async (disputeId: string, eventId: string) => {
    try {
      const response = await api.post(`/disputes/${disputeId}/settlement/${eventId}/decline`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },
};
