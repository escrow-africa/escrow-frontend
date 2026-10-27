import { api } from "./axios";

export const walletApi = {
  // Previously these four caught their own errors and showed an alert()/toast() internally,
  // then returned undefined instead of re-throwing. Callers (FundWalletFlow, the wallet store)
  // couldn't tell a failed call apart from a real response with no fields set, so they fell
  // through to their success path anyway - e.g. funding a wallet that actually failed to charge
  // still showed "Wallet funded successfully!". Letting the error propagate lets each caller's
  // own catch block (which already exists and already shows a real error) actually run.
  getWalletDetails: async (page = 1, limit = 20) => {
    const response = await api.get(`/wallet/details?page=${page}&limit=${limit}`);
    return response.data;
  },

  getBankList: async () => {
    const response = await api.get("/wallet/banks");
    return response.data;
  },

  fundWallet: async (payload: { amount: number; method: string;[key: string]: any }) => {
    const response = await api.post("/wallet/topup", payload);
    return response.data;
  },

  verifyCardOtp: async (payload: { token: string; transactionReference: string; tokenId: string;[key: string]: any }) => {
    const response = await api.post("/wallet/card-otp", payload);
    return response.data;
  },

  verifyCardPin: async (payload: { transactionReference: string; pin: string; card: { number: string; expiryMonth: string; expiryYear: string; cvv?: string } }) => {
    const response = await api.post("/wallet/card-pin", payload);
    return response.data;
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

