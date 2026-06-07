import { api } from "./axios";


export const walletApi = {
  getWalletDetails: async (userId?: string) => {
    try {
      const endpoint = userId ? `/wallet/${userId}` : "/wallet";
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      if (userId && error?.response?.status === 403) {
        console.warn("Wallet detail fetch forbidden for /wallet/${userId}, retrying /wallet");
        const fallbackResponse = await api.get("/wallet");
        return fallbackResponse.data;
      }
      console.error("Failed to fetch wallet details:", error);
      throw error;
    }
  },

  getBankList: async () => {
    try {
      const response = await api.get("/wallet/banks");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bank list:", error);
      throw error;
    }
  },

  fundWallet: async (payload: { amount: number; method: string;[key: string]: any }) => {
    try {
      const response = await api.post("/wallet/topup", payload);
      return response.data;
    } catch (error) {
      console.error("Top-up request failed:", error);
      throw error;
    }
  },

  verifyCardOtp: async (payload: { token: string; transactionReference: string; tokenId: string;[key: string]: any }) => {
    try {
      const response = await api.post("/wallet/card-otp", payload);
      return response.data;
    } catch (error) {
      console.error("OTP Verification error:", error);
      throw error;
    }
  }
};

