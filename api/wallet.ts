import { api } from "./axios";


export const walletApi = {
  getWalletDetails: async (userId: string) => {
    // 
    try {
      const response = await api.get(`/wallet/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wallet details:", error);
      alert("Failed to fetch wallet details. Please try again.");
    }
  },

  getBankList: async () => {
    try {
      const response = await api.get("/wallet/banks");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bank list:", error);
      alert("Failed to fetch bank list. Please try again.");
    }
  },

  fundWallet: async (payload: { amount: number; method: string;[key: string]: any }) => {
    try {
      const response = await api.post("/wallet/topup", payload);
      return response.data;
    } catch (error) {
      console.error("Top-up request failed:", error);
      alert("Failed to initiate top-up. Please try again.");
    }
  },

  verifyCardOtp: async (payload: { token: string; transactionReference: string; tokenId: string;[key: string]: any }) => {
    try {
      const response = await api.post("/wallet/card-otp", payload);
      return response.data;
    } catch (error) {
      console.error("OTP Verification error:", error);
      alert("An error occurred during verification.");
    }
  }
};

