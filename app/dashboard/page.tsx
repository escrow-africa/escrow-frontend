"use client";

import React, { useEffect, useState, useMemo } from "react";
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

const formatCurrency = (val: any) => {
  try {
    const n = Number(val);
    if (Number.isNaN(n)) return String(val ?? "");
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(n);
  } catch {
    return String(val ?? "");
  }
};

export default function DashboardPage() {
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_fullName");
      if (saved) return saved.trim().split(" ")[0];
    }
    return "User";
  });
  const [activeEscrows, setActiveEscrows] = useState<ActiveEscrow[]>([]);
  const [loadingEscrows, setLoadingEscrows] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const { walletDetails, fetchWalletDetails, isLoadingDetails } = useWalletStore();
  const [stats, setStats] = useState<{ totalEarnings?: any; availableBalance?: any; escrowHeldFunds?: any; activeEscrows?: any } | null>(null);
  const router = useRouter();

  // Derive user name from token as fallback (synchronous, no re-render)
  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const fullName = decoded.fullName || decoded.name || decoded.username || decoded.email || "";
        if (fullName) {
          let name = fullName.includes("@") ? fullName.split("@")[0] : fullName;
          name = name.replace(/[._-]/g, " ");
          setUserName(name.trim().split(" ")[0].replace(/^\w/, (c: string) => c.toUpperCase()));
        }
      } catch { /* ignore */ }
    }
  }, []);

  // Single consolidated fetch — escrows + wallet + stats in parallel
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [activeData, , statsData] = await Promise.allSettled([
        escrowApi.getActive(),
        fetchWalletDetails(),
        authApi.getStats(),
      ]);

      if (!mounted) return;

      if (activeData.status === "fulfilled") {
        let data: any = activeData.value;
        if (!Array.isArray(data)) {
          data = data?.results || data?.items || (data?.data && Array.isArray(data.data) ? data.data : [data]);
        }
        const mapped: ActiveEscrow[] = (data || []).map((it: any) => {
          const status = (it.status || '').toUpperCase();
          return {
            id: String(it.id),
            title: it.description || it.title || "Escrow",
            partnerName: it.user?.name || "—",
            amount: formatCurrency(it.escrowAmount ?? it.amount ?? 0),
            dotColorClass: status.includes('DISPUTE') ? 'bg-red-500' : status.includes('RELEASE') ? 'bg-emerald-500' : status.includes('REVIEW') ? 'bg-yellow-500' : 'bg-blue-500',
          };
        });
        setActiveEscrows(mapped);
      }
      setLoadingEscrows(false);

      if (statsData.status === "fulfilled") {
        setStats(statsData.value || null);
      }
      setLoadingStats(false);
    };

    load();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statCards = useMemo(() => [
    {
      title: "Total Earnings",
      value: loadingStats ? "—" : formatCurrency(stats?.totalEarnings ?? 0),
      icon: <TrendingUp size={20} />,
      iconBgClass: "bg-emerald-500/10",
      iconColorClass: "text-emerald-500",
      topRight: <span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +0%</span>,
    },
    {
      title: "Available Balance",
      value: loadingStats ? "—" : formatCurrency(stats?.availableBalance ?? 0),
      icon: <Wallet size={20} />,
      iconBgClass: "bg-teal-500/10",
      iconColorClass: "text-teal-600",
      topRight: <span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +0%</span>,
    },
    {
      title: "Escrow-held Funds",
      value: loadingStats ? "—" : formatCurrency(stats?.escrowHeldFunds ?? 0),
      icon: <ShieldCheck size={20} />,
      iconBgClass: "bg-orange-500/10",
      iconColorClass: "text-orange-500",
      topRight: <span className="text-orange-500 flex items-center gap-1"><Clock size={14} /> 0 Items</span>,
    },
    {
      title: "Incoming Escrows",
      value: loadingStats ? "—" : `${stats?.activeEscrows ?? 0} Active`,
      icon: <Clock size={20} />,
      iconBgClass: "bg-blue-500/10",
      iconColorClass: "text-blue-500",
      topRight: <span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={14} /> +0%</span>,
    },
  ], [stats, loadingStats]);

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
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={<>{card.value}</>}
            icon={card.icon}
            iconBgClass={card.iconBgClass}
            iconColorClass={card.iconColorClass}
            topRightContent={card.topRight}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8 mb-8">
          <QuickActions />
          <TransactionList
            transactions={walletDetails?.transactions}
            isLoading={isLoadingDetails}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
          <PremiumReminderModal />
          <ActiveEscrowsList escrows={activeEscrows} isLoading={loadingEscrows} />
        </div>
      </div>
    </div>
  );
}
