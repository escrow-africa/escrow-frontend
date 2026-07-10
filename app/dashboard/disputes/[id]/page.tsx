"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, X } from "lucide-react";
import DisputeTimeline from "../../../../components/dashboard/disputes/DisputeTimeline";
import EvidenceChat from "../../../../components/dashboard/disputes/EvidenceChat";
import CompromiseLedgerSidebar from "../../../../components/dashboard/disputes/CompromiseLedgerSidebar";
import CompromiseOfferModal from "../../../../components/dashboard/disputes/CompromiseOfferModal";
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
  const { messages, setMessages, sendMessage } = useDisputeChat(id);

  const dispute = mockDisputeData[id] || mockDisputeData["DSP-001"];

  // Compromise offer flow states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProposal, setActiveProposal] = useState<{
    type: "split" | "refund" | "release";
    buyerAmount: number;
    sellerAmount: number;
    ratio: string;
  } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");

  const handleSendProposal = (proposal: {
    type: "split" | "refund" | "release";
    buyerAmount: number;
    sellerAmount: number;
    ratio: string;
  }) => {
    // 1. Close modal
    setIsModalOpen(false);

    // 2. Set active proposal for sidebar ledger display
    setActiveProposal(proposal);

    // 3. Set notification toast details
    let text = "";
    if (proposal.type === "split") {
      text = `Proposal registered: Split ₦${proposal.buyerAmount.toLocaleString()} to Madeleine / ₦${proposal.sellerAmount.toLocaleString()} to Louis`;
    } else if (proposal.type === "refund") {
      text = `Proposal registered: Refund ₦${proposal.buyerAmount.toLocaleString()} to Madeleine / ₦${proposal.sellerAmount.toLocaleString()} to Louis`;
    } else if (proposal.type === "release") {
      text = `Proposal registered: Release ₦${proposal.sellerAmount.toLocaleString()} to Louis`;
    }
    setNotificationText(text);
    setShowNotification(true);

    // 4. Append simulated automated system arbitrator messages to chat history
    const systemMsg1 = {
      id: `EV-SYS-1-${Date.now()}`,
      type: "message" as const,
      sender: "EscrowAfrica Ledger",
      senderInitial: "L",
      timestamp: "2026-06-25 • 06:00",
      content: "Greetings counterparties. I am EscrowAfrica's Escrow's automated arbitrator. The ₦79,000.00 collateral balance for BUY-804 has been suspended. Seller has been notified to present evidence rebuttals.",
      isUserMessage: false,
    };

    const systemMsg2 = {
      id: `EV-SYS-2-${Date.now()}`,
      type: "message" as const,
      sender: "EscrowAfrica Ledger",
      senderInitial: "L",
      timestamp: "2026-06-25 • 06:00",
      content: `Agreement executed. ₦${proposal.buyerAmount.toLocaleString()} refunded to Buyer wallet. ₦${proposal.sellerAmount.toLocaleString()} released to Seller. Escrow contract closed.`,
      isUserMessage: false,
    };

    setMessages((prev) => [...prev, systemMsg1, systemMsg2]);
  };

  return (
    <div className="relative space-y-6 pb-12">
      {/* Dark Dispute Security Toast Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 w-80 bg-[#090D16] text-white border border-gray-800 rounded-xl p-4 shadow-2xl flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={16} className="text-gray-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              DISPUTE SECURITY
            </h4>
            <p className="text-[11px] text-gray-300 font-medium leading-normal">
              {notificationText}
            </p>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-gray-500 hover:text-white transition-colors p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

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
            onProposeSettlement={() => setIsModalOpen(true)}
          />
        </div>

        {/* Right Sidebar */}
        <div className="lg:sticky lg:top-4">
          <CompromiseLedgerSidebar
            onDraftOffer={() => setIsModalOpen(true)}
            onSpeedUpDesk={() => console.log("Speed up broker desk clicked")}
            activeProposal={activeProposal}
          />
        </div>
      </div>

      {/* Compromise Offer Modal */}
      <CompromiseOfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendProposal={handleSendProposal}
      />
    </div>
  );
}
