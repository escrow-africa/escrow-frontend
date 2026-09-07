"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface CompromiseOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendProposal: (message: string) => void;
  isSubmitting?: boolean;
  disputedAmount: number;
  buyerName: string;
  sellerName: string;
}

export default function CompromiseOfferModal({
  isOpen,
  onClose,
  onSendProposal,
  isSubmitting = false,
  disputedAmount,
  buyerName,
  sellerName,
}: CompromiseOfferModalProps) {
  const [terms, setTerms] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    if (!terms.trim()) return;
    onSendProposal(terms.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-[420px] p-6 shadow-2xl relative z-10 border border-gray-50 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 mt-1">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            Draft Escrow Compromise Offer
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed max-w-[280px] mx-auto">
            Propose how to divide the ₦{disputedAmount.toLocaleString()} locked collateral between {buyerName} and {sellerName}.
          </p>
        </div>

        <div className="mb-6">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            PROPOSED TERMS
          </label>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            disabled={isSubmitting}
            rows={4}
            placeholder={`e.g. Refund ${buyerName} 50%, release 50% to ${sellerName}`}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20 focus:border-[#0F3D2E] transition-colors resize-none bg-gray-50/50 disabled:opacity-50"
          />
          <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl p-3 flex gap-2 items-start mt-3">
            <AlertCircle size={14} className="text-[#D97706] flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#B45309] font-medium leading-relaxed">
              This posts your proposal to the case chat and formally opens a settlement offer that the other party can accept or decline.
            </p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-800 rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 transition-colors text-center cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSubmitting || !terms.trim()}
            className="flex-1 px-4 py-3 bg-[#0F3D2E] hover:bg-[#185541] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition-colors text-center cursor-pointer"
          >
            {isSubmitting ? "Sending…" : "Send Proposal"}
          </button>
        </div>
      </div>
    </div>
  );
}
