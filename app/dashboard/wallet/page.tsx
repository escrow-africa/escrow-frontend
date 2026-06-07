"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WalletCard from "../../../components/dashboard/wallet/WalletCard";
import PendingFundsCard from "../../../components/dashboard/wallet/PendingFundsCard";
import TransactionHistory, { TransactionItem } from "../../../components/dashboard/transaction/TransactionHistory";
import TransactionDetail from "../../../components/dashboard/transaction/TransactionDetail";
import WithdrawFundsFlow from "../../../components/dashboard/wallet/WithdrawFundsFlow";
import { useWalletStore } from "../../../store/walletStore";
import { getTokenFromCookie } from "../../../utils/token";

export default function WalletPage() {
  const router = useRouter();
  const [viewState, setViewState] = useState<"overview" | "transaction_detail" | "withdraw_funds">("overview");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);

  const { walletDetails, isLoading, error, fetchWalletDetails } = useWalletStore();

  const getUserIdFromToken = () => {
    if (typeof window !== "undefined") {
      const token = getTokenFromCookie();
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
    const token = getTokenFromCookie();
    if (token) {
      fetchWalletDetails();
    }
  }, [fetchWalletDetails]);

  const handleFundWallet = () => {
    router.push("/dashboard/wallet/fund");
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
    const userId = getUserIdFromToken();
    if (userId) {
      fetchWalletDetails(userId);
    }
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
    <div className="flex flex-col h-full fade-in w-full py-8">

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
      ) : viewState === "withdraw_funds" ? (
        <div className="flex items-center justify-center mt-8 py-8">
          <WithdrawFundsFlow onComplete={handleBackToOverview} />
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
            {/* Main Green Card */}
            <div className="lg:col-span-8 flex h-full">
              <div className="w-full h-full">
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
            <div className="lg:col-span-4 flex flex-col gap-4 h-full">
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
