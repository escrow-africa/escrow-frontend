import { api } from "./axios";
import toast from "react-hot-toast";


export const walletApi = {
  getWalletDetails: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/wallet/details?page=${page}&limit=${limit}`);
      return response.data;
    } catch {
      toast.error("Failed to fetch wallet details. Please try again.");
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
  },

  getPayoutAccounts: async () => {
    const response = await api.get("/wallet/payout-accounts");
    return response.data;
  },

  addPayoutAccount: async (payload: { bankName: string; bankCode: string; accountNumber: string; accountName: string }) => {
    const response = await api.post("/wallet/payout-accounts", payload);
    return response.data;
  },

  deletePayoutAccount: async (id: string) => {
    const response = await api.delete(`/wallet/payout-accounts/${id}`);
    return response.data;
  },

  setDefaultPayoutAccount: async (id: string) => {
    const response = await api.patch(`/wallet/payout-accounts/${id}/default`);
    return response.data;
  },

  withdraw: async (payload: { amount: number; payoutAccountId: string }) => {
    const response = await api.post("/wallet/withdraw", payload);
    return response.data;
  },
};

