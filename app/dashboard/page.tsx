"use client";

import React, { useState, useEffect } from "react";
import StatCard from "../../components/dashboard/shared/StatCard";
import QuickActions from "../../components/dashboard/shared/QuickActions";
import TransactionList, { Transaction } from "../../components/dashboard/transaction/TransactionList";
import ActiveEscrowsList, { ActiveEscrow } from "../../components/dashboard/escrow/ActiveEscrowsList";
import PremiumReminderModal from "../../components/dashboard/shared/PremiumReminderModal";
import { TrendingUp, Wallet, ShieldCheck, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "../../utils/token";
import { useWalletStore } from "../../store/walletStore";
import { escrowApi } from "../../api/escrow";

const dotColorClasses = [
  "bg-blue-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-pink-500",
];

type RawEscrowItem = Record<string, any>;

function normalizeEscrowItem(item: RawEscrowItem, index: number): ActiveEscrow {
  const amountValue = item.amount || item.baseAmount || item.escrowAmount || item.totalAmount || item.payoutAmount || "0";
  const formattedAmount = typeof amountValue === "number"
    ? `₦${amountValue.toLocaleString()}`
    : typeof amountValue === "string"
      ? amountValue.startsWith("₦") ? amountValue : `₦${amountValue}`
      : "₦0";

  return {
    id: item.id || item._id || item.escrowId || `escrow-${index}`,
    title: item.title || item.description || item.mainDeliverable || item.service || "Escrow Transaction",
    partnerName: item.partnerName || item.buyerName || item.sellerName || item.customerName || item.counterparty || "Partner",
    amount: formattedAmount,
    dotColorClass: dotColorClasses[index % dotColorClasses.length],
  };
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const [activeEscrows, setActiveEscrows] = useState<ActiveEscrow[]>([]);
  const { walletDetails, fetchWalletDetails } = useWalletStore();
  const router = useRouter();

  const getTokenPayload = () => {
    if (typeof window === "undefined") return null;
    const token = getTokenFromCookie();
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const payload = getTokenPayload();
    if (!payload) return;

    const fullName = payload.fullName || payload.name || payload.username || payload.email || "";
    if (fullName) {
      let name = fullName.includes("@") ? fullName.split("@")[0] : fullName;
      name = name.replace(/[._-]/g, " ");
      const firstWord = name.trim().split(" ")[0];
      const capitalized = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
      setUserName(capitalized);
    }

    const userId = payload.userId || payload.id || payload.sub;
    if (userId) {
      fetchWalletDetails(userId.toString());
    }

    const loadActiveEscrows = async () => {
      try {
        const response = await escrowApi.getActive();
        const rawEscrows = Array.isArray(response)
          ? response
          : response?.active || response?.escrows || response?.data || [];

        if (!Array.isArray(rawEscrows)) return;

        setActiveEscrows(rawEscrows.map(normalizeEscrowItem));
      } catch (error) {
        console.error("Failed to load active escrows", error);
      }
    };

    loadActiveEscrows();
  }, [fetchWalletDetails]);

  const transactions = walletDetails?.transactions || [];

  return (
    <div className="flex flex-col h-full fade-in pb-24 scrollbar-hide">
      {/* Welcome Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground text-xs">
            Here's what's happening with your account today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => router.push('/dashboard/wallet?action=fund')}
            className="w-full sm:w-auto px-4 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current pb-0.5">+</span>
            Fund Wallet
          </button>
          <button
            onClick={() => router.push('/dashboard/create-escrow')}
            className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-hover rounded-xl text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck size={18} />
            Create Escrow
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Earnings"
          value={<>₦12,500.50</>}
          icon={<TrendingUp size={20} />}
          iconBgClass="bg-emerald-500/10"
          iconColorClass="text-emerald-500"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +2.5%</span>}
        />
        <StatCard
          title="Available Balance"
          value={<>₦4,200.50</>}
          icon={<Wallet size={20} />}
          iconBgClass="bg-teal-500/10"
          iconColorClass="text-teal-600"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +2.5%</span>}
        />
        <StatCard
          title="Escrow-held Funds"
          value={<>₦3,150.00</>}
          icon={<ShieldCheck size={20} />}
          iconBgClass="bg-orange-500/10"
          iconColorClass="text-orange-500"
          topRightContent={<span className="text-orange-500 flex items-center gap-1"><Clock size={14} /> 2 Items</span>}
        />
        <StatCard
          title="Incoming Escrows"
          value={<>5 Active</>}
          icon={<Clock size={20} />}
          iconBgClass="bg-blue-500/10"
          iconColorClass="text-blue-500"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +2.5%</span>}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (Transactions & Quick Actions) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 mb-0">
          <QuickActions />
          <TransactionList transactions={transactions} />
        </div>

        {/* Right Column (Active Escrows & Ads/Promo) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          <PremiumReminderModal />
          <ActiveEscrowsList escrows={activeEscrows} />
        </div>
      </div>

    </div>
  );
}
