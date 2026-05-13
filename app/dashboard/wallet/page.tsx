"use client";

import React, { useState, useEffect } from "react";
import WalletCard from "../../../components/dashboard/wallet/WalletCard";
import PendingFundsCard from "../../../components/dashboard/wallet/PendingFundsCard";
import TransactionHistory, { TransactionItem } from "../../../components/dashboard/transaction/TransactionHistory";
import TransactionDetail from "../../../components/dashboard/transaction/TransactionDetail";
import FundWalletFlow from "../../../components/dashboard/wallet/FundWalletFlow";
import WithdrawFundsFlow from "../../../components/dashboard/wallet/WithdrawFundsFlow";
import { useWalletStore } from "../../../store/walletStore";

export default function WalletPage() {
  const [viewState, setViewState] = useState<"overview" | "transaction_detail" | "fund_wallet" | "withdraw_funds">("overview");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);

  const { walletDetails, isLoading, error, fetchWalletDetails } = useWalletStore();

  const getUserIdFromToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          return decoded.userId || decoded.id || decoded.sub;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      fetchWalletDetails(userId);
    }
  }, [fetchWalletDetails]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("action") === "fund") {
        setViewState("fund_wallet");
        // Clear param so subsequent back-navigations behave normally
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleFundWallet = () => {
    setViewState("fund_wallet");
  };

  const handleWithdrawFunds = () => {
    setViewState("withdraw_funds");
  };

  const handleTransactionSelect = (tx: TransactionItem) => {
    setSelectedTransaction(tx);
    setViewState("transaction_detail");
  };

  const handleBackToOverview = () => {
    setSelectedTransaction(null);
    setViewState("overview");
  };

  // Safe fallbacks if wallet details are missing or loading
  const balance = walletDetails?.balance?.toLocaleString() || "0.00";
  const pendingProcessing = walletDetails?.pendingProcessing?.toLocaleString() || "0.00";
  const pendingActive = walletDetails?.pendingActive?.toLocaleString() || "0.00";
  const virtualAccount = walletDetails?.virtualAccount || {
    accountNumber: "**** **** ****",
    accountName: "Loading...",
    bankName: "..."
  };
  const transactions = walletDetails?.transactions || [];

  return (
    <div className="flex flex-col h-full fade-in pb-12 w-full pt-2">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0F3D2E]">Wallet</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-xl">
          {error}
        </div>
      )}

      {viewState === "transaction_detail" && selectedTransaction ? (
        <div className="mt-8">
          <TransactionDetail 
            transaction={selectedTransaction} 
            onBack={handleBackToOverview} 
          />
        </div>
      ) : viewState === "fund_wallet" ? (
        <div className="flex h-full items-center justify-center mt-8 pb-12">
          <FundWalletFlow onComplete={handleBackToOverview} userId={getUserIdFromToken()} />
        </div>
      ) : viewState === "withdraw_funds" ? (
        <div className="flex h-full items-center justify-center mt-8 pb-12">
          <WithdrawFundsFlow onComplete={handleBackToOverview} />
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            {/* Main Green Card */}
            <div className="lg:col-span-8 flex">
              <div className="w-full">
                <WalletCard
                  balance={balance}
                  accountNumber={virtualAccount.accountNumber}
                  expiryDate=""
                  cardHolder={virtualAccount.accountName}
                  onFundWallet={handleFundWallet}
                  onWithdrawFunds={handleWithdrawFunds}
                />
              </div>
            </div>

            {/* Pending Cards Stack */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <PendingFundsCard
                amount={pendingProcessing}
                statusText="PROCESSING (24-48H)"
                type="processing"
                onActionClick={() => console.log("Details processing")}
              />
              <PendingFundsCard
                amount={pendingActive}
                statusText="ACTIVE ESCROW TRANSACTIONS"
                type="active"
                onActionClick={() => console.log("Manage active")}
              />
            </div>
          </div>

          {/* Bottom Section - Transaction History */}
          <div className="w-full">
            <TransactionHistory 
              transactions={transactions}
              onSelectTransaction={handleTransactionSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
