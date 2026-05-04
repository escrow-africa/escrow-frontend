import React from "react";
import Link from "next/link";
import { Clock, ShieldCheck, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";

export type EscrowStatus = "RELEASED" | "SECURED" | "IN_REVIEW" | "IN_DISPUTE";

export interface EscrowCardProps {
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
}

export default function EscrowCard({
  id,
  displayId,
  partnerName,
  avatarInitials,
  avatarBgClass = "bg-[#E6F4EA]", // default light green
  status,
  mainDeliverable,
  escrowAmount,
  payoutAmount,
  updatedAt,
}: EscrowCardProps) {
  
  const getStatusConfig = () => {
    switch (status) {
      case "RELEASED":
        return {
          bg: "bg-[#E6F4EA]",
          text: "text-[#0F3D2E]",
          icon: <CheckCircle2 size={12} className="mr-1" />,
          label: "RELEASED"
        };
      case "SECURED":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          icon: <ShieldCheck size={12} className="mr-1" />,
          label: "SECURED"
        };
      case "IN_REVIEW":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-600",
          icon: <Clock size={12} className="mr-1" />,
          label: "IN REVIEW"
        };
      case "IN_DISPUTE":
        return {
          bg: "bg-red-50",
          text: "text-red-500",
          icon: <AlertCircle size={12} className="mr-1" />,
          label: "IN DISPUTE"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: null,
          label: status
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Link href={`/dashboard/escrows/ESC-101`} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col hover:shadow-md transition-shadow group">
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[#0F3D2E] ${avatarBgClass}`}>
              {avatarInitials}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{partnerName}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{displayId}</p>
            </div>
          </div>
          <div className={`flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${statusConfig.bg} ${statusConfig.text}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        </div>

        {/* Main Deliverable */}
        <div className="mb-5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Main Deliverable</p>
          <p className="font-semibold text-gray-900 text-sm">{mainDeliverable}</p>
        </div>

        {/* Amount Box */}
        <div className="bg-[#F8FAF9] rounded-xl p-4 flex justify-between items-center group-hover:bg-[#f1f4f2] transition-colors">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Escrow Amount</p>
            <p className="font-bold text-gray-900 text-lg">{escrowAmount}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Payout</p>
            <p className="font-bold text-[#00A859] text-sm">{payoutAmount}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50 rounded-b-2xl flex justify-between items-center group-hover:bg-gray-100/50 transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Clock size={12} />
          Updated {updatedAt}
        </div>
        <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
      </div>
    </Link>
  );
}
