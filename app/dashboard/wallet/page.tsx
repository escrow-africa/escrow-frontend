"use client";

import React, { useState, useEffect } from "react";
import WalletCard from "../../../components/dashboard/WalletCard";
import PendingFundsCard from "../../../components/dashboard/PendingFundsCard";
import TransactionHistory, { TransactionItem } from "../../../components/dashboard/TransactionHistory";
import TransactionDetail from "../../../components/dashboard/TransactionDetail";
import FundWalletFlow from "../../../components/dashboard/FundWalletFlow";
import WithdrawFundsFlow from "../../../components/dashboard/WithdrawFundsFlow";

// Mock Data representing backend connection eventually
const MOCK_WALLET_DATA = {
  balance: "400,200.50",
  accountNumber: "**** **** 4290",
  expiryDate: "12 / 28",
  cardHolder: "Madeleine Nkiru",
  pendingProcessing: "350,000.00",
  pendingActive: "53,500.00",
};

const MOCK_TRANSACTIONS: TransactionItem[] = [
  { id: "TX-9021", title: "Escrow payout from John Doe", date: "3/20/2026, 6:30:00 AM", amount: "700,000.00", type: "in", status: "COMPLETED", paymentMethod: "GAfrica Wallet" },
  { id: "TX-9022", title: "Withdrawal to GTBank", date: "3/20/2026, 8:15:00 AM", amount: "400,000.00", type: "out", status: "PENDING", paymentMethod: "Bank Transfer" },
  { id: "TX-9023", title: "Ad Promotion: Premium UI Kit", date: "3/20/2026, 12:45:00 PM", amount: "200,000.00", type: "in", status: "COMPLETED", paymentMethod: "Card" },
  { id: "TX-9024", title: "Ad Promotion: Premium UI Kit", date: "3/20/2026, 1:20:00 PM", amount: "200,000.00", type: "in", status: "COMPLETED", paymentMethod: "Card" },
];

export default function WalletPage() {
  const [viewState, setViewState] = useState<"overview" | "transaction_detail" | "fund_wallet" | "withdraw_funds">("overview");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);

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

  return (
    <div className="flex flex-col h-full fade-in pb-12 w-full pt-2">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F3D2E]">Wallet</h1>
      </div>

      {viewState === "transaction_detail" && selectedTransaction ? (
        <div className="mt-8">
          <TransactionDetail 
            transaction={selectedTransaction} 
            onBack={handleBackToOverview} 
          />
        </div>
      ) : viewState === "fund_wallet" ? (
        <div className="flex h-full items-center justify-center mt-8 pb-12">
          <FundWalletFlow onComplete={handleBackToOverview} />
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
                  balance={MOCK_WALLET_DATA.balance}
                  accountNumber={MOCK_WALLET_DATA.accountNumber}
                  expiryDate={MOCK_WALLET_DATA.expiryDate}
                  cardHolder={MOCK_WALLET_DATA.cardHolder}
                  onFundWallet={handleFundWallet}
                  onWithdrawFunds={handleWithdrawFunds}
                />
              </div>
            </div>

            {/* Pending Cards Stack */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <PendingFundsCard
                amount={MOCK_WALLET_DATA.pendingProcessing}
                statusText="PROCESSING (24-48H)"
                type="processing"
                onActionClick={() => console.log("Details processing")}
              />
              <PendingFundsCard
                amount={MOCK_WALLET_DATA.pendingActive}
                statusText="4 ACTIVE TRANSACTIONS"
                type="active"
                onActionClick={() => console.log("Manage active")}
              />
            </div>
          </div>

          {/* Bottom Section - Transaction History */}
          <div className="w-full">
            <TransactionHistory 
              transactions={MOCK_TRANSACTIONS}
              onSelectTransaction={handleTransactionSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
