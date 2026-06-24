"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { ShieldCheck, Clock, Search } from "lucide-react";
import EscrowStatCard from "../../../components/dashboard/escrow/EscrowStatCard";
import EscrowCard, { EscrowStatus } from "../../../components/dashboard/escrow/EscrowCard";
import { escrowApi } from "../../../api/escrow";

type Tab = "active" | "completed" | "disputed";

interface MappedEscrow {
  id: string;
  displayId: string;
  partnerName: string;
  avatarInitials: string;
  avatarBgClass?: string;
  status: EscrowStatus;
  mainDeliverable: string;
  escrowAmount: string;
  payoutAmount: string;
  updatedAt: string;
  tab: Tab;
}

const formatCurrency = (val: any) => {
  try {
    const n = Number(val);
    if (Number.isNaN(n)) return String(val ?? "");
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(n);
  } catch {
    return String(val ?? "");
  }
};

const mapToCard = (item: any, tab: Tab): MappedEscrow | null => {
  try {
    const id = item.id;
    const displayId = item.escrowCode || `#${String(id).slice(0, 8)}`;
    const partnerName = item.user?.name || "Unknown";
    const initials = partnerName.split(' ').map((s: string) => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U';
    const statusRaw = (item.status || '').toString().toUpperCase();
    const status: EscrowStatus = statusRaw.includes('RELEASE') || statusRaw.includes('COMPLET') ? 'RELEASED' : statusRaw.includes('DISPUTE') ? 'IN_DISPUTE' : statusRaw.includes('REVIEW') || statusRaw.includes('DELIVER') ? 'IN_REVIEW' : 'SECURED';
    const escrowAmount = item.amount ?? item.escrowAmount ?? item.value ?? 0;
    const payoutAmount = item.payoutAmount ?? item.payout ?? 0;
    const updatedAt = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-NG") : "";

    return {
      id: String(id),
      displayId,
      partnerName,
      avatarInitials: initials,
      avatarBgClass: 'bg-[#E6F4EA]',
      status,
      mainDeliverable: item.description || item.title || "Escrow",
      escrowAmount: formatCurrency(escrowAmount),
      payoutAmount: formatCurrency(payoutAmount),
      updatedAt,
      tab,
    };
  } catch {
    return null;
  }
};

export default function EscrowsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [search, setSearch] = useState("");
  // Per-tab cache so switching tabs doesn't re-fetch
  const cache = useRef<Partial<Record<Tab, MappedEscrow[]>>>({});
  const [escrows, setEscrows] = useState<MappedEscrow[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTotal, setActiveTotal] = useState<string>("");
  const [pendingRelease, setPendingRelease] = useState<string>("");
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Load stats + initial active tab in one go
  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      setLoading(true);
      const [activeResult, statsResult] = await Promise.allSettled([
        escrowApi.getActive(),
        escrowApi.getStats(),
      ]);

      if (!mounted) return;

      if (activeResult.status === "fulfilled") {
        let data: any = activeResult.value;
        if (!Array.isArray(data)) data = data?.results || data?.items || (data?.data && Array.isArray(data.data) ? data.data : [data]);
        const mapped = (data || []).map((d: any) => mapToCard(d, "active")).filter(Boolean) as MappedEscrow[];
        cache.current.active = mapped;
        setEscrows(mapped);
      }
      setLoading(false);

      if (statsResult.status === "fulfilled") {
        const data: any = statsResult.value;
        const act = data?.totalActiveEscrowAmount ?? data?.activeAmount ?? data?.active ?? undefined;
        const pending = data?.pendingReleaseAmount ?? data?.pendingRelease ?? data?.pending ?? undefined;
        if (act !== undefined) setActiveTotal(formatCurrency(act));
        if (pending !== undefined) setPendingRelease(formatCurrency(pending));
        setStatsLoaded(true);
      }
    };

    bootstrap();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch when switching to completed or disputed tabs (cached after first load)
  useEffect(() => {
    if (activeTab === "active") {
      if (cache.current.active) setEscrows(cache.current.active);
      return;
    }

    if (cache.current[activeTab]) {
      setEscrows(cache.current[activeTab]!);
      return;
    }

    let mounted = true;
    setLoading(true);

    const fetchTab = async () => {
      try {
        const data: any = activeTab === "completed" ? await escrowApi.getCompleted() : await escrowApi.getDisputed();
        let arr = data;
        if (!Array.isArray(arr)) arr = arr?.results || arr?.items || (arr?.data && Array.isArray(arr.data) ? arr.data : [arr]);
        const mapped = (arr || []).map((d: any) => mapToCard(d, activeTab)).filter(Boolean) as MappedEscrow[];
        cache.current[activeTab] = mapped;
        if (mounted) setEscrows(mapped);
      } catch {
        if (mounted) setEscrows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTab();
    return () => { mounted = false; };
  }, [activeTab]);

  const filteredEscrows = useMemo(() => {
    if (!search.trim()) return escrows;
    const q = search.toLowerCase();
    return escrows.filter(e =>
      e.partnerName.toLowerCase().includes(q) ||
      e.displayId.toLowerCase().includes(q) ||
      e.mainDeliverable.toLowerCase().includes(q)
    );
  }, [escrows, search]);

  return (
    <div className="flex flex-col h-full fade-in pb-12 mb-24">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Escrow Lab</h1>
          <p className="text-gray-500 text-sm">Securely manage your high-value transactions</p>
        </div>
        <Link href="/dashboard/create-escrow" className="px-6 py-2.5 bg-[#0F3D2E] hover:bg-[#185541] rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2 shadow-md">
          <ShieldCheck size={18} />
          Create New Escrow
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <EscrowStatCard
          title="ACTIVE ESCROWS"
          value={statsLoaded ? activeTotal : "—"}
          icon={<ShieldCheck size={20} />}
          iconBgClass="bg-[#E6F4EA]"
          iconColorClass="text-[#0F3D2E]"
        />
        <EscrowStatCard
          title="PENDING RELEASE"
          value={statsLoaded ? pendingRelease : "—"}
          icon={<Clock size={20} />}
          iconBgClass="bg-[#FFF4E5]"
          iconColorClass="text-[#FF9800]"
        />
        <EscrowStatCard
          title="PLATFORM PROTECTION"
          value="100%"
          icon={<ShieldCheck size={20} />}
          iconBgClass="bg-[#E6F4EA]"
          iconColorClass="text-[#0F3D2E]"
        />
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center bg-gray-50/50 p-1.5 rounded-[14px] border border-gray-100">
          {(["active", "completed", "disputed"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-white text-[#0F3D2E] shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[320px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, partner or deliverable..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20 focus:border-[#0F3D2E]/30 transition-all placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>

      {/* Escrows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-52 animate-pulse" />
          ))
        ) : filteredEscrows.length > 0 ? (
          filteredEscrows.map(escrow => (
            <EscrowCard
              key={escrow.id}
              id={escrow.id}
              displayId={escrow.displayId}
              partnerName={escrow.partnerName}
              avatarInitials={escrow.avatarInitials}
              avatarBgClass={escrow.avatarBgClass}
              status={escrow.status}
              mainDeliverable={escrow.mainDeliverable}
              escrowAmount={escrow.escrowAmount}
              payoutAmount={escrow.payoutAmount}
              updatedAt={escrow.updatedAt}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center py-12">No escrows found.</p>
        )}
      </div>
    </div>
  );
}
