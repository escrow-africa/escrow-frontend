import { api } from "./axios";

export const settingsApi = {
  // Billing Information
  getBilling: async () => {
    try {
      const response = await api.get("/auth/billing");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  updateBilling: async (payload: { companyName: string; vatId: string; billingAddress: string }) => {
    try {
      const response = await api.put("/auth/billing", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Notification Preferences
  getNotificationPreferences: async () => {
    try {
      const response = await api.get("/auth/notification-preferences");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  updateNotificationPreferences: async (payload: {
    escrowContractReleases: boolean;
    dispersalClearingAlerts: boolean;
    disputeArbitrationWarning: boolean;
    tipsPromotionalAnalytics: boolean;
  }) => {
    try {
      const response = await api.put("/auth/notification-preferences", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // General Preferences (Localization)
  getPreferences: async () => {
    try {
      const response = await api.get("/auth/preferences");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  updatePreferences: async (payload: { currency: string; language: string; timezone: string }) => {
    try {
      const response = await api.put("/auth/preferences", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // User Profile
  updateProfile: async (payload: { firstName: string; lastName: string; bio: string }) => {
    try {
      const response = await api.patch("/auth/me", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // KYC Status & Submit
  getKycStatus: async () => {
    try {
      const response = await api.get("/auth/kyc/status");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  submitKyc: async (formData: FormData) => {
    try {
      const response = await api.post("/auth/kyc", formData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Avatar Upload
  uploadAvatar: async (formData: FormData) => {
    try {
      const response = await api.post("/auth/avatar", formData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
