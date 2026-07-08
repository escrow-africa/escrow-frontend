import React from "react";
import { AlertCircle, ChevronRight } from "lucide-react";

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
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          Escrow Compromise Ledger
        </h3>

        {!hasActiveProposal ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-4">
              No active proposal registered yet
            </p>
            <button
              onClick={onDraftOffer}
              className="w-full px-4 py-2.5 bg-[#0F3D2E] hover:bg-[#185541] text-white rounded-lg font-medium text-sm transition-colors"
            >
              Draft Compromise Offer
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-bold text-blue-900 mb-1">
                PROPOSAL AMOUNT
              </p>
              <p className="text-lg font-bold text-blue-900">₦79,000</p>
            </div>
            <button className="w-full px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
              View Details
            </button>
          </div>
        )}
      </div>

      {/* Evidence Description */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          Evidence Description
        </h3>
        <button className="w-full px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm text-gray-900 font-medium transition-colors flex items-center justify-center gap-2">
          Add custom proof log
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Anchored File Records */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          Anchored File Records (2)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Flaws-ui.png</span>
            <span className="text-xs font-bold text-green-600">ANCHORED</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Wireframe.pdf</span>
            <span className="text-xs font-bold text-green-600">ANCHORED</span>
          </div>
        </div>
      </div>

      {/* Broker Live Mediation */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          Broker Live Mediation
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          Want to fast-track your resolution? Request an expedited broker desk for quicker mediation.
        </p>
        <button
          onClick={onSpeedUpDesk}
          className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
        >
          Speed Up Broker Desk
        </button>
      </div>

      {/* Warning Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
        <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-yellow-900 mb-1">
            Regulatory Notice
          </p>
          <p className="text-xs text-yellow-800">
            Once submitted, the active escrow custody wallet is instantly suspended. The counterparty has 72 hours to respond with materials.
          </p>
        </div>
      </div>
    </div>
  );
}
