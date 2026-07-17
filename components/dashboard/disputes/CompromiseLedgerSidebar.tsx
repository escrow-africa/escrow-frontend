import React from "react";
import { Sliders, CloudUpload, FileText, ChevronRight } from "lucide-react";

export interface ProposalItem {
  id: string;
  type: "split" | "refund" | "release";
  status: "ACCEPTED" | "PENDING" | "REJECTED";
  buyerAmount: number;
  sellerAmount: number;
  ratio: string;
}

interface CompromiseLedgerSidebarProps {
  hasActiveProposal?: boolean;
  activeProposal?: {
    type: "split" | "refund" | "release";
    buyerAmount: number;
    sellerAmount: number;
    ratio: string;
  } | null;
  proposals?: ProposalItem[];
  onDraftOffer?: () => void;
  onSpeedUpDesk?: () => void;
}

export default function CompromiseLedgerSidebar({
  hasActiveProposal = false,
  activeProposal = null,
  proposals = [],
  onDraftOffer,
  onSpeedUpDesk,
}: CompromiseLedgerSidebarProps) {
  // If proposals list is empty, but we have activeProposal from parent, format it into list
  let displayProposals: ProposalItem[] = [...proposals];
  if (displayProposals.length === 0 && (activeProposal || hasActiveProposal)) {
    displayProposals.push({
      id: "active-prop",
      type: activeProposal?.type || "split",
      status: "ACCEPTED",
      buyerAmount: activeProposal?.buyerAmount ?? 39500,
      sellerAmount: activeProposal?.sellerAmount ?? 39500,
      ratio: activeProposal?.ratio || "50% / 50%",
    });
  }

  const showEmptyState = displayProposals.length === 0;

  return (
    <div className="space-y-4">
      {/* Escrow Compromise Ledger */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          Escrow Compromise Ledger
        </h3>

        {showEmptyState ? (
          <div className="text-center py-6 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <Sliders size={18} className="text-gray-400 rotate-90" />
            </div>
            <p className="text-xs text-gray-400 mb-4 font-medium">
              No active proposals registered yet.
            </p>
            <button
              onClick={onDraftOffer}
              className="w-full px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl font-bold text-xs shadow-sm transition-colors"
            >
              Draft Compromise Offer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayProposals.map((proposal) => {
              const isAccepted = proposal.status === "ACCEPTED";
              // Colors for OFFER type tag (Splits and Refunds use the same violet/purple theme in mockup, Release Pending uses yellow)
              let typeTagClass = "bg-[#FAF5FF] text-[#7E22CE]"; // Split or Refund accepted
              if (proposal.type === "release" && proposal.status === "PENDING") {
                typeTagClass = "bg-[#FFFBEB] text-[#D97706]";
              }

              // Heading text
              const typeText = proposal.type === "split" 
                ? "OFFER: SPLIT" 
                : proposal.type === "refund" 
                ? "OFFER: FULL REFUND" 
                : "OFFER: FULL RELEASE";

              return (
                <div key={proposal.id} className="space-y-3 border border-gray-50 rounded-2xl p-3 bg-gray-50/10">
                  <div className="flex justify-between items-center bg-gray-50/50 border border-gray-100 rounded-xl p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${typeTagClass}`}>
                      {typeText}
                    </span>
                    <span className={`px-2 py-0.5 border text-[9px] font-bold rounded uppercase tracking-wider ${
                      isAccepted
                        ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                        : "bg-[#FFFBEB] border-[#FEF3C7] text-[#D97706]"
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Refund Madeleine</span>
                      <span className="font-bold text-[#E53E3E]">
                        {proposal.buyerAmount > 0 ? `₦${proposal.buyerAmount.toLocaleString()}` : "N0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-gray-50 pt-2 mt-2">
                      <span className="text-gray-500 font-medium">Release Louis</span>
                      <span className="font-bold text-green-600">
                        {proposal.sellerAmount > 0 ? `₦${proposal.sellerAmount.toLocaleString()}` : "N0"}
                      </span>
                    </div>
                    {proposal.status === "PENDING" && (
                      <div className="text-[10px] text-gray-400 italic text-center pt-2">
                        Awaiting Seller's Response...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Evidence Description & Anchored Files */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          Evidence Description
        </h3>
        
        {/* Upload Block */}
        <div className="border-2 border-dashed border-gray-100 hover:border-gray-200 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white">
          <div className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center mx-auto mb-2">
            <CloudUpload size={16} className="text-[#E53E3E]" />
          </div>
          <p className="text-xs font-bold text-gray-800">
            Add custom proof log
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Auto-scans integrity data
          </p>
        </div>

        {/* Anchored File Records */}
        <div className="mt-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
            ANCHORED FILE RECORDS (1)
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border border-gray-50 rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-700 truncate">Flaws-ui.png</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-md text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
                ANCHORED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Live Mediation */}
      <div className="bg-[#FFF5F5] border border-[#FFE3E3] rounded-2xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
        <h3 className="text-xs font-bold text-[#C53030] uppercase tracking-wider mb-2">
          BROKER LIVE MEDIATION
        </h3>
        <p className="text-xs text-[#9B4040] leading-relaxed mb-4">
          Want to fast-track your resolution? Request an expedited manual investigation review from our certified desk legal broker.
        </p>
        <button
          onClick={onSpeedUpDesk}
          className="w-full px-4 py-3 bg-[#E53E3E] hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
        >
          Speed Up Broker Desk
        </button>
      </div>
    </div>
  );
}
