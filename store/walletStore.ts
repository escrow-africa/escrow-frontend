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
  transactions?: any[];
  [key: string]: any;
}

export interface Bank {
  code: string;
  name: string;
  [key: string]: any;
}

// Cache TTL: 60 seconds — skips refetch if data was loaded within this window
const WALLET_TTL_MS = 60_000;

interface WalletState {
  walletDetails: WalletDetails | null;
  banks: Bank[];
  isLoadingDetails: boolean;
  isLoadingBanks: boolean;
  isLoading: boolean; // unified flag for fund/otp actions
  error: string | null;
  lastFetchedAt: number | null;

  fetchWalletDetails: (force?: boolean) => Promise<void>;
  fetchBankList: () => Promise<void>;
  fundWallet: (payload: any) => Promise<any>;
  verifyCardOtp: (payload: any) => Promise<any>;
  invalidate: () => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  walletDetails: null,
  banks: [],
  isLoadingDetails: false,
  isLoadingBanks: false,
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  fetchWalletDetails: async (force = false) => {
    const { isLoadingDetails, lastFetchedAt } = get();

    // Skip if already loading (deduplication)
    if (isLoadingDetails) return;

    // Skip if data is fresh enough and not forced
    if (!force && lastFetchedAt && Date.now() - lastFetchedAt < WALLET_TTL_MS) return;

    set({ isLoadingDetails: true, error: null });
    try {
      const response = await walletApi.getWalletDetails();

      const backendWallet = response?.wallet || response?.data?.wallet || response;
      const backendPayments =
        response?.transactions || response?.data?.transactions || response?.payments || response?.data?.payments || [];

      const mappedDetails: WalletDetails = {
        balance: parseFloat(backendWallet?.balance || 0),
        virtualAccount: {
          accountNumber: backendWallet?.accountNumber || "**** **** ****",
          accountName: backendWallet?.accountName || "Wallet User",
          bankName: backendWallet?.bankName || "Bank",
        },
        transactions: backendPayments.slice(0, 20).map((p: any) => ({
          id: p.id,
          title: `${(p.paymentType || p.type) === "ESCROW" ? "Escrow Funding" : "Wallet Funding"} (${p.method || p.provider || "Card"})`,
          date: p.createdAt || p.created_at ? new Date(p.createdAt || p.created_at).toLocaleDateString("en-NG") : new Date().toLocaleDateString("en-NG"),
          amount: `₦${parseFloat(p.amount || p.value || 0).toLocaleString()}`,
          type: "in",
          status: p?.status,
          raw: p,
        })),
      };

      set({ walletDetails: mappedDetails, isLoadingDetails: false, lastFetchedAt: Date.now() });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch wallet details",
        isLoadingDetails: false,
      });
    }
  },

  fetchBankList: async () => {
    const { isLoadingBanks, banks } = get();

    // Skip if already loading or banks are cached
    if (isLoadingBanks || banks.length > 0) return;

    set({ isLoadingBanks: true, error: null });
    try {
      const response = await walletApi.getBankList();
      set({ banks: response.data || response, isLoadingBanks: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch bank list",
        isLoadingBanks: false,
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
        error: error?.response?.data?.message || "Failed to fund wallet",
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
        error: error?.response?.data?.message || "Failed to verify OTP",
        isLoading: false,
      });
      throw error;
    }
  },

  // Call after fund/withdraw to force a fresh fetch on next access
  invalidate: () => set({ lastFetchedAt: null }),

  clearError: () => set({ error: null }),
}));
