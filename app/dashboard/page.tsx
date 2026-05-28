"use client";

import React, { useState } from "react";
import StatCard from "../../components/dashboard/shared/StatCard";
import QuickActions from "../../components/dashboard/shared/QuickActions";
import TransactionList, { Transaction } from "../../components/dashboard/transaction/TransactionList";
import ActiveEscrowsList, { ActiveEscrow } from "../../components/dashboard/escrow/ActiveEscrowsList";
import PremiumReminderModal from "../../components/dashboard/shared/PremiumReminderModal";
import { TrendingUp, Wallet, ShieldCheck, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "../../utils/token";

// Mock Data for UI presentation. 
// Replace with actual API fetches in the future.
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", title: "Escrow payout from John Doe", date: "3/20/2026", amount: "₦700,000", type: "in", status: "COMPLETED" },
  { id: "2", title: "Withdrawal to GTBank", date: "3/20/2026", amount: "₦400,000", type: "out", status: "PENDING" },
  { id: "3", title: "Ad Promotion: Premium UI Kit", date: "3/20/2026", amount: "₦200,000", type: "in", status: "COMPLETED" },
  { id: "4", title: "Ad Promotion: Premium UI Kit", date: "3/20/2026", amount: "₦200,000", type: "in", status: "COMPLETED" },
  { id: "5", title: "Ad Promotion: Premium UI Kit", date: "3/20/2026", amount: "₦200,000", type: "in", status: "COMPLETED" },
];

const MOCK_ESCROWS: ActiveEscrow[] = [
  { id: "1", title: "MacBook ProM3 Max", partnerName: "TechStore NG", amount: "₦700,000", dotColorClass: "bg-blue-500" },
  { id: "2", title: "UI/UX Design Retainer", partnerName: "FinTech Solutions", amount: "₦800,000", dotColorClass: "bg-yellow-500" },
  { id: "3", title: "Logo Design Package", partnerName: "Creative Studio", amount: "₦500,000", dotColorClass: "bg-emerald-500" },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const router = useRouter();

  React.useEffect(() => {
    const getSavedName = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("user_fullName");
        if (saved) return saved;
      }
      const token = getTokenFromCookie();
      if (token) {
        try {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          return decoded.fullName || decoded.name || decoded.username || decoded.email || "";
        } catch (e) {
          return "";
        }
      }
      return "";
    };

    const fullName = getSavedName();
    if (fullName) {
      let name = fullName.includes("@") ? fullName.split("@")[0] : fullName;
      name = name.replace(/[._-]/g, " ");
      const firstWord = name.trim().split(" ")[0];
      const capitalized = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
      setUserName(capitalized);
    }
  }, []);



  return (
    <div className="flex flex-col h-full fade-in pb-24">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's what's happening with your account today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => router.push('/dashboard/wallet?action=fund')}
            className="w-full sm:w-auto px-6 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-surface-hover transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current pb-0.5">+</span>
            Fund Wallet
          </button>
          <button
            onClick={() => router.push('/dashboard/create-escrow')}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck size={18} />
            Create Escrow
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Transactions & Quick Actions) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8 mb-8">
          <QuickActions />
          <TransactionList transactions={MOCK_TRANSACTIONS} />
        </div>

        {/* Right Column (Active Escrows & Ads/Promo) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
          <PremiumReminderModal />
          <ActiveEscrowsList escrows={MOCK_ESCROWS} />
        </div>
      </div>

    </div>
  );
}
