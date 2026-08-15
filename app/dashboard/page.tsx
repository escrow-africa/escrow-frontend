"use client";

import React, { useEffect, useState } from "react";
import StatCard from "../../components/dashboard/shared/StatCard";
import QuickActions from "../../components/dashboard/shared/QuickActions";
import TransactionList from "../../components/dashboard/transaction/TransactionList";
import ActiveEscrowsList, { ActiveEscrow } from "../../components/dashboard/escrow/ActiveEscrowsList";
import PremiumReminderModal from "../../components/dashboard/shared/PremiumReminderModal";
import { TrendingUp, Wallet, ShieldCheck, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "../../utils/token";
import { escrowApi } from "../../api/escrow";
import { useWalletStore } from "../../store/walletStore";
import { authApi } from "../../api/auth";

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const [activeEscrows, setActiveEscrows] = useState<ActiveEscrow[]>([]);
  const [loadingActiveEscrows, setLoadingActiveEscrows] = useState(false);
  const { walletDetails, fetchWalletDetails } = useWalletStore();
  const [stats, setStats] = useState<{ totalEarnings?: any; availableBalance?: any; escrowHeldFunds?: any; activeEscrows?: any } | null>(null);

  const formatCurrency = (val: any) => {
    try {
      const n = Number(val);
      if (Number.isNaN(n)) return String(val ?? "");
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(n);
    } catch {
      return String(val ?? "");
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchActive = async () => {
      setLoadingActiveEscrows(true);
      try {
        const response: any = await escrowApi.getActive(1, 5);
        const data: any[] = Array.isArray(response) ? response : response?.data || [];

        const mapped: ActiveEscrow[] = (data || []).map((it: any) => {
          const status = (it.status || it.state || '').toString().toUpperCase();
          const id = it.id;
          const title = it.description;
          const partnerName = it.user?.name;
          const amountRaw = it.escrowAmount ?? it.amount ?? it.value ?? it.baseAmount ?? 0;
          const amount = typeof amountRaw === 'number' ? formatCurrency(amountRaw) : (String(amountRaw).startsWith('₦') ? String(amountRaw) : formatCurrency(amountRaw));
          const dotColorClass = status.includes('DISPUTE') ? 'bg-red-500' : status.includes('RELEASE') ? 'bg-emerald-500' : status.includes('REVIEW') ? 'bg-yellow-500' : 'bg-blue-500';

          return {
            id: String(id),
            title,
            partnerName,
            amount,
            dotColorClass,
          };
        });

        if (mounted) setActiveEscrows(mapped.length ? mapped : []);
      } catch {
        if (mounted) setActiveEscrows([]);
      } finally {
        if (mounted) setLoadingActiveEscrows(false);
      }
    };

    fetchActive();
    return () => { mounted = false; };
  }, []);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await fetchWalletDetails(1, 5);
      } catch (e) {
        console.error('Failed to fetch wallet details for dashboard', e);
      }
    })();

    (async () => {
      try {
        const s = await authApi.getStats();
        console.log({ s });
        setStats(s || null);
      } catch (e) {
        console.error('Failed to fetch auth stats', e);
      }
    })();
  }, []);

  useEffect(() => {
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
        } catch {
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
            Here&rsquo;s what&rsquo;s happening with your account today.
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
          value={<> {stats?.totalEarnings ? formatCurrency(stats.totalEarnings) : <>₦0.00</>} </>}
          icon={<TrendingUp size={20} />}iconBgClass="bg-emerald-500/10"
          iconColorClass="text-emerald-500"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +0%</span>}
        />
        <StatCard
          title="Available Balance"
          value={<> {stats?.availableBalance ? formatCurrency(stats.availableBalance) : <>₦0.00</>} </>}
          icon={<Wallet size={20} />}iconBgClass="bg-teal-500/10"
          iconColorClass="text-teal-600"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +0%</span>}
        />
        <StatCard
          title="Escrow-held Funds"
          value={<> {stats?.escrowHeldFunds ? formatCurrency(stats.escrowHeldFunds) : <>₦0.00</>} </>}
          icon={<ShieldCheck size={20} />}iconBgClass="bg-orange-500/10"
          iconColorClass="text-orange-500"
          topRightContent={<span className="text-orange-500 flex items-center gap-1"><Clock size={14} /> 0 Items</span>}
        />
        <StatCard
          title="Incoming Escrows"
          value={<> {stats?.activeEscrows ? `${stats.activeEscrows} Active` : <>0 Active</>} </>}
          icon={<Clock size={20} />}iconBgClass="bg-blue-500/10"
          iconColorClass="text-blue-500"
          topRightContent={<span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +0%</span>}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Transactions & Quick Actions) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8 mb-8">
          <QuickActions />
          <TransactionList transactions={walletDetails?.transactions} />
        </div>

        {/* Right Column (Active Escrows & Ads/Promo) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
          <PremiumReminderModal />
          <ActiveEscrowsList escrows={activeEscrows} />
        </div>
      </div>
    </div>
  );
}
