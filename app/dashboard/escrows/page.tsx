"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Clock, Search } from "lucide-react";
import EscrowStatCard from "../../../components/dashboard/escrow/EscrowStatCard";
import EscrowCard, { EscrowStatus } from "../../../components/dashboard/escrow/EscrowCard";
import { escrowApi } from "../../../api/escrow";

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

const MOCK_ESCROWS: MockEscrow[] = [
  {
    id: "ESC-103",
    displayId: "#ESC-103",
    partnerName: "Charlie Man",
    avatarInitials: "C",
    avatarBgClass: "bg-[#E6F4EA]", // light green
    status: "RELEASED",
    mainDeliverable: "Social Media Graphics",
    escrowAmount: "₦200,150.00",
    payoutAmount: "₦200,000",
    updatedAt: "2026-04-20",
    tab: "completed"
  },
  {
    id: "ESC-101",
    displayId: "#ESC-101",
    partnerName: "Madeleine Nkiru",
    avatarInitials: "M",
    avatarBgClass: "bg-[#E6F4EA]",
    status: "SECURED",
    mainDeliverable: "Logo Design Service",
    escrowAmount: "₦52,150.00",
    payoutAmount: "₦52,000.00",
    updatedAt: "2026-04-20",
    tab: "active"
  },
  {
    id: "ESC-102",
    displayId: "#ESC-102",
    partnerName: "Ruby Thomas",
    avatarInitials: "R",
    avatarBgClass: "bg-[#E6F4EA]",
    status: "IN_REVIEW",
    mainDeliverable: "E-Commerce Website",
    escrowAmount: "₦202,150.00",
    payoutAmount: "₦202,000",
    updatedAt: "2026-04-20",
    tab: "active"
  },
  {
    id: "ESC-104",
    displayId: "#ESC-104",
    partnerName: "David Charles",
    avatarInitials: "D",
    avatarBgClass: "bg-[#E6F4EA]",
    status: "IN_DISPUTE",
    mainDeliverable: "Mobile App Prototype",
    escrowAmount: "₦250,150.00",
    payoutAmount: "₦250,000",
    updatedAt: "2026-04-20",
    tab: "disputed"
  }
];

export default function EscrowsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "disputed">("active");
  const [escrows, setEscrows] = useState<MockEscrow[]>(MOCK_ESCROWS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTotal, setActiveTotal] = useState<string>("₦102,751.32");
  const [pendingRelease, setPendingRelease] = useState<string>("₦62,000.00");

  const filteredEscrows = escrows.filter(escrow => escrow.tab === activeTab);

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
    const partnerName = item.user.name;
    const initials = partnerName.split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase() || 'U';
    const statusRaw = (item.status || item.state || '').toString().toUpperCase();
    const status: EscrowStatus = statusRaw.includes('RELEASE') ? 'RELEASED' : statusRaw.includes('DISPUTE') ? 'IN_DISPUTE' : statusRaw.includes('REVIEW') ? 'IN_REVIEW' : 'SECURED';
    const mainDeliverable = item.description;
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
        let data: any[] = [];
        if (activeTab === 'active') {
          data = await escrowApi.getActive();
        } else if (activeTab === 'completed') {
          data = await escrowApi.getCompleted();
        } else {
          data = await escrowApi.getDisputed();
        }

        if (!Array.isArray(data)) {
          // some APIs wrap results in { data: [...] }
          data = data?.results || data?.items || (data?.data && Array.isArray(data.data) ? data.data : [data]);
        }

        const mapped = (data || []).map(d => mapToCard(d, activeTab));
        if (mounted) setEscrows(mapped.length ? mapped : []);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load escrows');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => { mounted = false; };
  }, [activeTab]);

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
    </div>
  );
}
