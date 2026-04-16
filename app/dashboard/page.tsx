"use client";

import React, { useState } from "react";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import TransactionList, { Transaction } from "../../components/dashboard/TransactionList";
import ActiveEscrowsList, { ActiveEscrow } from "../../components/dashboard/ActiveEscrowsList";
import PremiumReminderModal from "../../components/dashboard/PremiumReminderModal";
import { TrendingUp, Wallet, ShieldCheck, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [userName] = useState("Madeleine");
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const router = useRouter();

  // In a real app, this might be triggered by a timer or condition
  // useEffect(() => {
  //   const timer = setTimeout(() => setIsReminderOpen(true), 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="flex flex-col h-full fade-in pb-12">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-500 text-sm">
            Here's what's happening with your account today.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/dashboard/wallet?action=fund')}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current pb-0.5">+</span>
            Fund Wallet
          </button>
          <button 
            onClick={() => router.push('/dashboard/create-escrow')}
            className="px-6 py-2.5 bg-[#0F3D2E] hover:bg-[#185541] rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2 shadow-md"
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
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-500"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +2.5%</span>}
        />
        <StatCard
          title="Available Balance"
          value={<>₦4,200.50</>}
          icon={<Wallet size={20} />}
          iconBgClass="bg-teal-50"
          iconColorClass="text-teal-600"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +2.5%</span>}
        />
        <StatCard
          title="Escrow-held Funds"
          value={<>₦3,150.00</>}
          icon={<ShieldCheck size={20} />}
          iconBgClass="bg-orange-50"
          iconColorClass="text-orange-500"
          topRightContent={<span className="text-orange-500 flex items-center gap-1"><Clock size={14} /> 2 Items</span>}
        />
        <StatCard
          title="Incoming Escrows"
          value={<>5 Active</>}
          icon={<Clock size={20} />}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +2.5%</span>}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Transactions & Quick Actions) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          <QuickActions />
          <TransactionList transactions={MOCK_TRANSACTIONS} />
        </div>
        
        {/* Right Column (Active Escrows & Ads/Pro spaces) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
          <ActiveEscrowsList escrows={MOCK_ESCROWS} />
        </div>
      </div>

      {/* Periodic Reminder Modal */}
      <PremiumReminderModal 
        isOpen={isReminderOpen} 
        onClose={() => setIsReminderOpen(false)} 
      />
      
      {/* Dev Tool: Button to toggle modal for testing purposes */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={() => setIsReminderOpen(true)}
          className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg opacity-50 hover:opacity-100 transition-opacity text-xs z-50"
        >
          Test Premium Reminder
        </button>
      )}
    </div>
  );
}
