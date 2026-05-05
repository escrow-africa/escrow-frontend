"use client";

import React, { useState } from "react";
import { ShieldCheck, Clock, Search } from "lucide-react";
import EscrowStatCard from "../../../components/dashboard/escrow/EscrowStatCard";
import EscrowCard, { EscrowStatus } from "../../../components/dashboard/escrow/EscrowCard";

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
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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

  const filteredEscrows = MOCK_ESCROWS.filter(escrow => escrow.tab === activeTab);

  return (
    <div className="flex flex-col h-full fade-in pb-12 mb-24">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Escrow Lab</h1>
          <p className="text-gray-500 text-sm">Securely manage your high-value transactions</p>
        </div>
        <button className="px-6 py-2.5 bg-[#0F3D2E] hover:bg-[#185541] rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2 shadow-md">
          <ShieldCheck size={18} />
          Create New Escrow
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <EscrowStatCard
          title="ACTIVE ESCROWS"
          value="₦102,751.32"
          icon={<ShieldCheck size={20} />}
          iconBgClass="bg-[#E6F4EA]"
          iconColorClass="text-[#0F3D2E]"
        />
        <EscrowStatCard
          title="PENDING RELEASE"
          value="₦62,000.00"
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
        {filteredEscrows.map(escrow => (
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
        ))}
      </div>
    </div>
  );
}
