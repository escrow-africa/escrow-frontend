import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import DisputeCard from "./DisputeCard";
import Pagination from "../../Pagination";
import { DisputeCard as DisputeCardType } from "../../../types/disputes";

interface DisputesListProps {
  disputes: DisputeCardType[];
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onRaiseDispute?: () => void;
}

export default function DisputesList({
  disputes,
  page,
  limit,
  total,
  onPageChange,
  onRaiseDispute,
}: DisputesListProps) {
  return (
    <div className="space-y-6">
      {/* Header with Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0F3D2E]">
            Security Mediation & Disputes
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review buyer disputes, upload proof, and manage dynamic settlements.
          </p>
        </div>
        <Link
          href="/dashboard/disputes/create"
          className="px-5 py-2.5 bg-[#E53E3E] hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <AlertCircle size={16} className="fill-white text-[#E53E3E]" />
          <span>Raise Dispute</span>
        </Link>
      </div>

      {/* Info Box - Security Mediation */}
      <div className="bg-[#FFF5F5] border border-[#FFE3E3] rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[#E53E3E] text-white flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-white fill-[#E53E3E]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#C53030] mb-1">
              Secure Escrow Conflict Resolution
            </h3>
            <p className="text-xs text-[#9B4040] leading-relaxed max-w-3xl">
              Under the EscrowAfrica Broker guidelines, disputing locking subsists automatic release countdowns. Both parties have 7 days to agree on a compromise split, or a certified arbitrator will make a definitive binding ruling.
            </p>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-lg shadow-sm tracking-wider shrink-0 transition-colors">
          REVIEW RULEBOOK
        </button>
      </div>

      {/* Disputes Grid */}
      <div className="grid grid-cols-1 gap-4">
        {disputes.length > 0 ? (
          disputes.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              id={dispute.id}
              issueId={dispute.issueId}
              orderRef={dispute.orderRef}
              date={dispute.date}
              title={dispute.title}
              description={dispute.description}
              amount={dispute.amount}
              status={dispute.status}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No disputes found</p>
          </div>
        )}
      </div>

      <Pagination page={page} limit={limit} total={total} onPageChange={onPageChange} itemLabel="disputes" />
    </div>
  );
}
