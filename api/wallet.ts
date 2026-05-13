import { api } from "./axios";

export const walletApi = {
  getWalletDetails: async (userId: string) => {
    const response = await api.get(`/wallet/${userId}`);
    return response.data;
  },
  
  getBankList: async () => {
    const response = await api.get("/wallet/banks");
    return response.data;
  },

  fundWallet: async (payload: { amount: number; paymentMethod: string; [key: string]: any }) => {
    const response = await api.post("/wallet/topup", payload);
    return response.data;
  },

  verifyCardOtp: async (payload: { otp: string; reference?: string; [key: string]: any }) => {
    const response = await api.post("/wallet/card-otp", payload);
    return response.data;
  }
};
