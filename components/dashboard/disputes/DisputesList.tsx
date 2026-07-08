import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
          <h2 className="text-2xl font-bold text-gray-900">
            Security Mediation & Disputes
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review buyer disputes, upload proof, and manage dynamic settlements.
          </p>
        </div>
        <Link
          href="/dashboard/disputes/create"
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>Raise Dispute</span>
        </Link>
      </div>

      {/* Info Box - Security Mediation */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
          G
        </div>
        <div>
          <h3 className="text-sm font-bold text-red-900 mb-1">
            Secure Escrow Conflict Resolution
          </h3>
          <p className="text-xs text-red-800 mb-2">
            Under the EscrowAfrica Broker guidelines, disputing locking subsists automatic release countdowns. Both parties have 7 days to agree on a compromise split, or a certified arbitrator will make a definitive call.
          </p>
          <button className="text-xs font-bold text-red-600 hover:text-red-700 underline">
            REVIEW RULEBOOK
          </button>
        </div>
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
          <p className="text-sm text-gray-500">
            Showing Page {currentPage} of {totalPages} ({disputes.length} items total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-medium transition-colors ${
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
              className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
