"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Clock, Search } from "lucide-react";
import EscrowStatCard from "../../../components/dashboard/escrow/EscrowStatCard";
import EscrowCard, { EscrowStatus } from "../../../components/dashboard/escrow/EscrowCard";
import Pagination from "../../../components/Pagination";
import { escrowApi } from "../../../api/escrow";

const ESCROWS_PER_PAGE = 12;

interface MockEscrow {
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
  tab: "active" | "completed" | "disputed";
}

export default function EscrowsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "disputed">("active");
  const [escrows, setEscrows] = useState<MockEscrow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTotal, setActiveTotal] = useState<string>("₦0.00");
  const [pendingRelease, setPendingRelease] = useState<string>("₦0.00");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Reset to page 1 whenever the tab changes so switching tabs doesn't strand the user on a
  // page number that may not exist for the new tab's result set.
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const filteredEscrows = escrows.filter((escrow) => {
    if (escrow.tab !== activeTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return escrow.id.toLowerCase().includes(q) || escrow.partnerName.toLowerCase().includes(q);
  });

  const formatCurrency = (val: any) => {
    try {
      const n = Number(val);
      if (Number.isNaN(n)) return String(val ?? "");
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(n);
    } catch {
      return String(val ?? "");
    }
  };

  const mapToCard = (item: any, tab: "active" | "completed" | "disputed"): MockEscrow => {
    const id = item.id;
    const displayId = item.escrowCode;
    const partnerName = item.user?.name || item.user?.email || "Unknown";
    const initials = partnerName.split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase() || 'U';
    const statusRaw = (item.status || item.state || '').toString().toUpperCase();
    const status: EscrowStatus = statusRaw.includes('RELEASE')
      ? 'RELEASED'
      : statusRaw.includes('DISPUTE')
      ? 'IN_DISPUTE'
      : statusRaw.includes('REVIEW')
      ? 'IN_REVIEW'
      : statusRaw === 'PENDING_APPROVAL'
      ? 'AWAITING_APPROVAL'
      : 'SECURED';
    const mainDeliverable = item.description || (Array.isArray(item.milestones) ? item.milestones.join(', ') : '') || '—';
    const escrowAmount = item.amount;
    const payoutAmount = item.payoutAmount ?? item.payout ?? 0;
    const updatedAt = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : (item.updatedAtString || item.updated || '');

    return {
      id: String(id),
      displayId,
      partnerName,
      avatarInitials: initials,
      avatarBgClass: 'bg-[#E6F4EA]',
      status,
      mainDeliverable,
      escrowAmount: typeof escrowAmount === 'number' || !String(escrowAmount).startsWith('₦') ? formatCurrency(escrowAmount) : String(escrowAmount),
      payoutAmount: typeof payoutAmount === 'number' || !String(payoutAmount).startsWith('₦') ? formatCurrency(payoutAmount) : String(payoutAmount),
      updatedAt,
      tab,
    };
  };

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        let response: any;
        if (activeTab === 'active') {
          response = await escrowApi.getActive(page, ESCROWS_PER_PAGE);
        } else if (activeTab === 'completed') {
          response = await escrowApi.getCompleted(page, ESCROWS_PER_PAGE);
        } else {
          response = await escrowApi.getDisputed(page, ESCROWS_PER_PAGE);
        }

        const data: any[] = Array.isArray(response) ? response : response?.data || [];
        const mapped = data.map((d: any) => mapToCard(d, activeTab));
        if (mounted) {
          setEscrows(mapped);
          setTotal(typeof response?.total === 'number' ? response.total : mapped.length);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.response?.data?.message || err?.message || 'Failed to load escrows');
          setEscrows([]);
          setTotal(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => { mounted = false; };
  }, [activeTab, page]);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const data: any = await escrowApi.getStats();

        const extract = (obj: any, keys: string[]) => {
          if (obj == null) return undefined;
          for (const k of keys) {
            if (obj[k] !== undefined && obj[k] !== null) return obj[k];
          }
          return undefined;
        };

        let act = extract(data, ['activeAmount','active_total','totalActiveEscrowAmount','active','total','activeAmountInK']);
        let pending = extract(data, ['pendingRelease','pending_release','pendingAmount','pending','pendingReleaseAmount']);

        // handle nested wrappers like { data: { ... } } or arrays
        if ((act === undefined || pending === undefined) && data?.data) {
          act = act ?? extract(data.data, ['activeAmount','active_total','totalActive','active','total']);
          pending = pending ?? extract(data.data, ['pendingRelease','pending_release','pendingAmount','pending']);
        }

        if ((act === undefined || pending === undefined) && Array.isArray(data) && data.length > 0) {
          act = act ?? extract(data[0], ['activeAmount','active_total','totalActive','active','total']);
          pending = pending ?? extract(data[0], ['pendingRelease','pending_release','pendingAmount','pending']);
        }

        if (act !== undefined) setActiveTotal(formatCurrency(act));
        if (pending !== undefined) setPendingRelease(formatCurrency(pending));
      } catch (err: any) {
        console.error('Failed to load escrow stats', err);
      }
    };

    fetchStats();
    return () => { mounted = false; };
  }, []);

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
          value={activeTotal}
          icon={<ShieldCheck size={20} />}
          iconBgClass="bg-[#E6F4EA]"
          iconColorClass="text-[#0F3D2E]"
        />
        <EscrowStatCard
          title="PENDING RELEASE"
          value={pendingRelease}
          icon={<Clock size={20} />}
          iconBgClass="bg-[#FFF4E5]"
          iconColorClass="text-[#FF9800]" // orange
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
        {/* Tabs */}
        <div className="flex items-center bg-gray-50/50 p-1.5 rounded-[14px] border border-gray-100">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'active' ? 'bg-white text-[#0F3D2E] shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'completed' ? 'bg-white text-[#0F3D2E] shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('disputed')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'disputed' ? 'bg-white text-[#0F3D2E] shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
          >
            Disputed
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-[320px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID or buyer..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20 focus:border-[#0F3D2E]/30 transition-all placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>

      {/* Escrows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredEscrows.length > 0 ? filteredEscrows.map(escrow => (
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
        )) : (
          <p className="text-gray-500">No escrows found.</p>
        )}
      </div>

      <Pagination page={page} limit={ESCROWS_PER_PAGE} total={total} onPageChange={setPage} itemLabel="escrows" />
    </div>
  );
}
