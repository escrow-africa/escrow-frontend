import { create } from "zustand";
import { walletApi } from "../api/wallet";

export interface WalletDetails {
  balance: number;
  pendingProcessing?: number;
  pendingActive?: number;
  virtualAccount?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  [key: string]: any;
}

export interface Bank {
  code: string;
  name: string;
  [key: string]: any;
}

interface WalletState {
  walletDetails: WalletDetails | null;
  banks: Bank[];
  isLoading: boolean;
  error: string | null;

  fetchWalletDetails: () => Promise<void>;
  fetchBankList: () => Promise<void>;
  fundWallet: (payload: any) => Promise<any>;
  verifyCardOtp: (payload: any) => Promise<any>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  walletDetails: null,
  banks: [],
  isLoading: false,
  error: null,

  fetchWalletDetails: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletApi.getWalletDetails();
      
      const backendWallet = response?.wallet || response?.data?.wallet || response;
      const backendPayments = response?.payments || response?.data?.payments || [];
      
      const mappedDetails = {
        balance: parseFloat(backendWallet?.balance || 0),
        virtualAccount: {
          accountNumber: backendWallet?.accountNumber || "**** **** ****",
          accountName: backendWallet?.accountName || "Wallet User",
          bankName: backendWallet?.bankName || "Bank"
        },
        transactions: backendPayments.map((p: any) => ({
          id: p.id,
          title: `Wallet Funding (${p.provider || "Card"})`,
          date: new Date().toLocaleDateString(),
          amount: `₦${parseFloat(p.amount || 0).toLocaleString()}`,
          type: "in",
          status: "COMPLETED"
        }))
      };

      set({ walletDetails: mappedDetails, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch wallet details",
        isLoading: false,
      });
    }
  },

  fetchBankList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletApi.getBankList();
      set({ banks: response.data || response, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch bank list",
        isLoading: false,
      });
    }
  },

  fundWallet: async (payload: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletApi.fundWallet(payload);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fund wallet",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyCardOtp: async (payload: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletApi.verifyCardOtp(payload);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to verify OTP",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
