import { api } from "./axios";


export const walletApi = {
  getWalletDetails: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/wallet/details?page=${page}&limit=${limit}`);
      return response.data;
    } catch {
      alert("Failed to fetch wallet details. Please try again.");
    }
  },

  getBankList: async () => {
    try {
      const response = await api.get("/wallet/banks");
      return response.data;
    } catch {
      alert("Failed to fetch bank list. Please try again.");
    }
  },

  fundWallet: async (payload: { amount: number; method: string;[key: string]: any }) => {
    try {
      const response = await api.post("/wallet/topup", payload);
      return response.data;
    } catch {
      alert("Failed to initiate top-up. Please try again.");
    }
  },

  verifyCardOtp: async (payload: { token: string; transactionReference: string; tokenId: string;[key: string]: any }) => {
    try {
      const response = await api.post("/wallet/card-otp", payload);
      return response.data;
    } catch {
      alert("An error occurred during verification.");
    }
  }
};

