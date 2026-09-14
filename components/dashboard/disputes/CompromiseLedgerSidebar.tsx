import React from "react";
import { Sliders, CloudUpload } from "lucide-react";

export interface ProposalItem {
  id: string;
  status: "ACCEPTED" | "PENDING" | "DECLINED";
  proposedByLabel: string;
  isMine: boolean;
  createdAt?: string;
}

interface CompromiseLedgerSidebarProps {
  proposals?: ProposalItem[];
  onDraftOffer?: () => void;
  onSpeedUpDesk?: () => void;
  onAccept?: (proposalId: string) => void;
  onDecline?: (proposalId: string) => void;
  isResponding?: boolean;
  truncatedNotice?: string;
}

export default function CompromiseLedgerSidebar({
  proposals = [],
  onDraftOffer,
  onSpeedUpDesk,
  onAccept,
  onDecline,
  isResponding = false,
  truncatedNotice,
}: CompromiseLedgerSidebarProps) {
  const showEmptyState = proposals.length === 0;

  return (
    <div className="space-y-4">
      {/* Escrow Compromise Ledger */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">
            Escrow Compromise Ledger
          </h3>
          {!showEmptyState && (
            <button
              onClick={onDraftOffer}
              className="text-[10px] font-bold text-[#0F3D2E] hover:underline"
            >
              + New Offer
            </button>
          )}
        </div>

        {truncatedNotice && (
          <p className="text-[10px] text-gray-400 mb-3 italic">{truncatedNotice}</p>
        )}
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
            {proposals.map((proposal) => (
              <div key={proposal.id} className="space-y-3 border border-gray-50 rounded-2xl p-3 bg-gray-50/10">
                <div className="flex justify-between items-center bg-gray-50/50 border border-gray-100 rounded-xl p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider bg-[#FAF5FF] text-[#7E22CE]">
                    SETTLEMENT OFFER
                  </span>
                  <span className={`px-2 py-0.5 border text-[9px] font-bold rounded uppercase tracking-wider ${
                    proposal.status === "ACCEPTED"
                      ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                      : proposal.status === "DECLINED"
                      ? "bg-gray-50 border-gray-200 text-gray-500"
                      : "bg-[#FFFBEB] border-[#FEF3C7] text-[#D97706]"
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                <div className="px-1">
                  <p className="text-xs text-gray-600 font-medium">
                    Proposed by <span className="font-bold text-gray-800">{proposal.proposedByLabel}</span>. See case chat for full terms.
                  </p>
                  {proposal.status === "PENDING" && !proposal.isMine && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onAccept?.(proposal.id)}
                        disabled={isResponding}
                        className="flex-1 py-2 text-xs font-bold text-white bg-[#0F3D2E] hover:bg-[#185541] rounded-lg transition-colors disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onDecline?.(proposal.id)}
                        disabled={isResponding}
                        className="flex-1 py-2 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  {proposal.status === "PENDING" && proposal.isMine && (
                    <div className="text-[10px] text-gray-400 italic text-center pt-2">
                      Awaiting the other party&apos;s response...
                    </div>
                  )}
                </div>
              </div>
            ))}
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
