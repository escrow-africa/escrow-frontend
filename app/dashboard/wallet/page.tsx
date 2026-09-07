"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WalletCard from "../../../components/dashboard/wallet/WalletCard";
import PendingFundsCard from "../../../components/dashboard/wallet/PendingFundsCard";
import TransactionHistory, { TransactionItem } from "../../../components/dashboard/transaction/TransactionHistory";
import TransactionDetail from "../../../components/dashboard/transaction/TransactionDetail";
import WithdrawFundsFlow from "../../../components/dashboard/wallet/WithdrawFundsFlow";
import Pagination from "../../../components/Pagination";
import { useWalletStore } from "../../../store/walletStore";
import FundWalletFlow from "@/components/dashboard/wallet/FundWalletFlow";

const TRANSACTIONS_PER_PAGE = 20;

export default function WalletPage() {
  const router = useRouter();
  const [viewState, setViewState] = useState<"overview" | "transaction_detail" | "withdraw_funds" | "fund_wallet">("overview");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);
  const [transactionsPage, setTransactionsPage] = useState(1);

  const { walletDetails, error, fetchWalletDetails, transactionsTotal } = useWalletStore();

  useEffect(() => {
    fetchWalletDetails(transactionsPage, TRANSACTIONS_PER_PAGE);
  }, [transactionsPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get("action");

      if (action === "fund") {
        setViewState("fund_wallet");
      } else if (action === "withdraw") {
        setViewState("withdraw_funds");
      }

      if (action) {
        // Clear param so subsequent back-navigation behave normally
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

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
    // A fund/withdraw flow may have just created a new transaction - jump back to page 1 so it's visible.
    if (transactionsPage === 1) {
      fetchWalletDetails(1, TRANSACTIONS_PER_PAGE);
    } else {
      setTransactionsPage(1);
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
      ) : viewState === "fund_wallet" ? (
        <div className="flex h-full items-center justify-center mt-8 pb-12">
          <FundWalletFlow onComplete={handleBackToOverview} />
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
            <Pagination
              page={transactionsPage}
              limit={TRANSACTIONS_PER_PAGE}
              total={transactionsTotal}
              onPageChange={setTransactionsPage}
              itemLabel="transactions"
            />
          </div>
        </div>
      )}
    </div>
  );
}
