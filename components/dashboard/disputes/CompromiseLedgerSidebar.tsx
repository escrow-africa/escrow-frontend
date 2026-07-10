import React from "react";
import { Sliders, CloudUpload, FileText, ChevronRight } from "lucide-react";

interface CompromiseLedgerSidebarProps {
  hasActiveProposal?: boolean;
  onDraftOffer?: () => void;
  onSpeedUpDesk?: () => void;
}

export default function CompromiseLedgerSidebar({
  hasActiveProposal = false,
  onDraftOffer,
  onSpeedUpDesk,
}: CompromiseLedgerSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Escrow Compromise Ledger */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          Escrow Compromise Ledger
        </h3>

        {!hasActiveProposal ? (
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
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-900 mb-1 tracking-wider uppercase">
                PROPOSAL AMOUNT
              </p>
              <p className="text-lg font-bold text-blue-900">₦79,000</p>
            </div>
            <button className="w-full px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl font-bold text-xs shadow-sm transition-colors">
              View Details
            </button>
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
