import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import DisputeCard from "./DisputeCard";
import { DisputeCard as DisputeCardType } from "../../../types/disputes";

interface DisputesListProps {
  disputes: DisputeCardType[];
  itemsPerPage?: number;
  onRaiseDispute?: () => void;
}

export default function DisputesList({
  disputes,
  itemsPerPage = 10,
  onRaiseDispute,
}: DisputesListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(disputes.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentDisputes = disputes.slice(startIdx, endIdx);

  const handlePrevious = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

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
        {currentDisputes.length > 0 ? (
          currentDisputes.map((dispute) => (
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

      {/* Pagination */}
      {disputes.length > 0 && (
        <div className="flex justify-between items-center py-4">
          <p className="text-xs text-gray-500 font-medium">
            Showing Page {currentPage} of {totalPages} ({disputes.length} items total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium text-gray-600 flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                    page === currentPage
                      ? "bg-[#0F3D2E] text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium text-gray-600 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
