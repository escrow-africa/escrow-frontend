"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import DisputeTimeline from "../../../../components/dashboard/disputes/DisputeTimeline";
import EvidenceChat from "../../../../components/dashboard/disputes/EvidenceChat";
import CompromiseLedgerSidebar from "../../../../components/dashboard/disputes/CompromiseLedgerSidebar";
import { useDisputeChat } from "../../../../hooks/useDisputeChat";
import { Dispute } from "../../../../types/disputes";

// Mock dispute data matching details screenshot (Screen 3)
const mockDisputeData: Record<string, Dispute> = {
  "DSP-001": {
    id: "DSP-001",
    issueId: "DIS-593",
    orderRef: "BUY-723",
    date: "2026-06-21",
    title: "Buggy Deliverables",
    description: "Figma grids are broken when imported into production tailwind components.",
    amount: "₦79,000",
    status: "INVESTIGATION_ACTIVE",
    claimStatement: "Figma grids are broken when imported into production tailwind components.",
    breachCategory: "Quality Issue",
    relatedContract: "BUY-723",
    timelineStage: "MEDIATION_ACTIVE",
    currentStageNumber: 3,
    totalStages: 4,
  },
  "DSP-002": {
    id: "DSP-002",
    issueId: "DIS-594",
    orderRef: "BUY-711",
    date: "2026-06-21",
    title: "Out of Scope",
    description: "Figma grids are broken when imported into production tailwind components.",
    amount: "₦102,000",
    status: "INVESTIGATION_ACTIVE",
    claimStatement: "Figma grids are broken when imported into production tailwind components.",
    breachCategory: "Out of Scope Demands / Contract Violation",
    relatedContract: "BUY-711",
    timelineStage: "MEDIATION_ACTIVE",
    currentStageNumber: 3,
    totalStages: 4,
  },
};

const TIMELINE_STAGES = [
  { title: "CONFLICT RAISED", status: "completed" as const },
  { title: "EVIDENCE LOCKED", status: "completed" as const },
  { title: "MEDIATION ACTIVE", status: "current" as const },
  { title: "AGREEMENT SETTLED", status: "upcoming" as const },
];

export default function DisputeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  // Initialize the real-time chat mock hook
  const { messages, sendMessage } = useDisputeChat(id);

  const dispute = mockDisputeData[id] || mockDisputeData["DSP-001"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Back Button */}
      <div>
        <button
          onClick={() => router.push("/dashboard/disputes")}
          className="text-gray-500 hover:text-gray-700 font-bold text-xs flex items-center gap-1 transition-colors"
        >
          <span>←</span> Back to Disputes
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Main Details & Chat) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Case Header Details Card */}
          <div className="bg-white rounded-2xl border border-gray-100 border-t-4 border-t-[#0F3D2E] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 bg-[#FFF0F0] text-[#E53E3E] text-[10px] font-bold rounded uppercase tracking-wider">
                    ACTIVE CASE DETAIL
                  </span>
                  <span className="inline-block px-2 py-0.5 bg-[#FFFBEB] border border-[#FEF3C7] text-[#D97706] text-[10px] font-bold rounded uppercase tracking-wider">
                    INVESTIGATION ACTIVE
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {dispute.title}
                </h2>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  Ledger ID: ARB-592 • Order: {dispute.orderRef}
                </p>
              </div>

              {/* Contested Amount Card */}
              <div className="bg-[#FFF5F5] border border-[#FFE3E3] rounded-xl px-4 py-2.5 text-center min-w-[130px] shrink-0">
                <p className="text-[9px] font-bold text-[#C53030] tracking-wider mb-1 uppercase">
                  CONTESTED AMOUNT
                </p>
                <p className="text-lg font-bold text-[#E53E3E]">
                  {dispute.amount}
                </p>
              </div>
            </div>

            {/* Claim Statement */}
            <div className="mt-6 p-4 bg-[#FAFBFA] border border-gray-100 rounded-xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                CLAIM STATEMENT
              </p>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                "{dispute.claimStatement}"
              </p>
            </div>
          </div>

          {/* Timeline progress */}
          <DisputeTimeline
            stages={TIMELINE_STAGES}
            currentStage={dispute.currentStageNumber}
            totalStages={dispute.totalStages}
          />

          {/* Dynamic Evidence Chat */}
          <EvidenceChat
            evidenceItems={messages}
            onSendMessage={sendMessage}
          />
        </div>

        {/* Right Sidebar */}
        <div className="lg:sticky lg:top-4">
          <CompromiseLedgerSidebar
            onDraftOffer={() => console.log("Draft offer clicked")}
            onSpeedUpDesk={() => console.log("Speed up broker desk clicked")}
            hasActiveProposal={false}
          />
        </div>
      </div>
    </div>
  );
}
