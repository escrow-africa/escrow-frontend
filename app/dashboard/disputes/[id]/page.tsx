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

type DemoState = "INITIAL" | "RELEASE_PROPOSED" | "RELEASE_PENDING" | "REFUND_ACCEPTED";

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

  // State management for interactive demo mockup screens
  const [demoState, setDemoState] = useState<DemoState>("INITIAL");

  // Compromise offer flow states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");

  // Handle auto-transitions for the Release Proposal flow
  React.useEffect(() => {
    if (demoState === "RELEASE_PROPOSED") {
      setNotificationText("Proposal registered: Release ₦79,000 to Louis / ₦0 to Madeleine");
      setShowNotification(true);

      const timer = setTimeout(() => {
        setDemoState("RELEASE_PENDING");
        setShowNotification(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [demoState]);

  // Dynamic timeline stages based on current state
  const timelineStages = [
    { title: "CONFLICT RAISED", status: "completed" as const },
    { title: "EVIDENCE LOCKED", status: "completed" as const },
    { 
      title: "MEDIATION ACTIVE", 
      status: (demoState === "RELEASE_PENDING" || demoState === "REFUND_ACCEPTED") ? "completed" as const : "current" as const 
    },
    { 
      title: "AGREEMENT SETTLED", 
      status: demoState === "REFUND_ACCEPTED" 
        ? "completed" as const 
        : demoState === "RELEASE_PENDING" 
        ? "current" as const 
        : "upcoming" as const 
    },
  ];

  // Dynamic ledger proposals array matching mockups
  const getProposals = () => {
    switch (demoState) {
      case "INITIAL":
        return [];
      case "RELEASE_PROPOSED":
        return [
          {
            id: "prop-split",
            type: "split" as const,
            status: "ACCEPTED" as const,
            buyerAmount: 39500,
            sellerAmount: 39500,
            ratio: "50% / 50%",
          }
        ];
      case "RELEASE_PENDING":
        return [
          {
            id: "prop-split",
            type: "split" as const,
            status: "ACCEPTED" as const,
            buyerAmount: 39500,
            sellerAmount: 39500,
            ratio: "50% / 50%",
          },
          {
            id: "prop-release",
            type: "release" as const,
            status: "PENDING" as const,
            buyerAmount: 0,
            sellerAmount: 79000,
            ratio: "0% / 100%",
          }
        ];
      case "REFUND_ACCEPTED":
        return [
          {
            id: "prop-split",
            type: "split" as const,
            status: "ACCEPTED" as const,
            buyerAmount: 39500,
            sellerAmount: 39500,
            ratio: "50% / 50%",
          },
          {
            id: "prop-refund",
            type: "refund" as const,
            status: "ACCEPTED" as const,
            buyerAmount: 79000,
            sellerAmount: 0,
            ratio: "100% / 0%",
          }
        ];
    }
  };

  // Combine typed chat messages with state-specific messages
  const getCombinedMessages = () => {
    const base = [...messages];
    if (demoState === "RELEASE_PENDING") {
      return [
        ...base,
        {
          id: "EV-SYS-RELEASE-PEND-1",
          type: "message" as const,
          sender: "EscrowAfrica Ledger",
          senderInitial: "L",
          timestamp: "2026-06-25 • 06:00",
          content: "Agreement executed. ₦79,000 refunded to Buyer wallet. N0 released to Seller. Escrow contract closed.",
          isUserMessage: false,
        },
        {
          id: "EV-REBUTTAL-1",
          type: "message" as const,
          sender: "Louis Client",
          senderInitial: "L",
          timestamp: "2026-06-21 • 05:18",
          content: "I cannot agree to a full release. The app is completely non-functional. Let's do a 50/50 split so we both cut our losses.",
          isUserMessage: false,
        }
      ];
    } else if (demoState === "REFUND_ACCEPTED") {
      return [
        ...base,
        {
          id: "EV-SYS-REFUND-ACC-1",
          type: "message" as const,
          sender: "EscrowAfrica Ledger",
          senderInitial: "L",
          timestamp: "2026-06-25 • 06:00",
          content: "Agreement executed. ₦39,500 refunded to Buyer wallet. ₦39,500 released to Seller. Escrow contract closed.",
          isUserMessage: false,
        },
        {
          id: "EV-SYS-REFUND-ACC-2",
          type: "message" as const,
          sender: "EscrowAfrica Ledger",
          senderInitial: "L",
          timestamp: "2026-06-25 • 06:00",
          content: "Agreement executed. ₦79,000 refunded to Buyer wallet. N0 released to Seller. Escrow contract closed.",
          isUserMessage: false,
        }
      ];
    }
    return base;
  };

  const handleSendProposal = (proposal: {
    type: "split" | "refund" | "release";
    buyerAmount: number;
    sellerAmount: number;
    ratio: string;
  }) => {
    setIsModalOpen(false);

    if (proposal.type === "release") {
      setDemoState("RELEASE_PROPOSED");
    } else if (proposal.type === "refund") {
      setDemoState("REFUND_ACCEPTED");
      setNotificationText(`Proposal registered: Refund ₦${proposal.buyerAmount.toLocaleString()} to Madeleine / ₦${proposal.sellerAmount.toLocaleString()} to Louis`);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
    } else {
      // Split
      setNotificationText(`Proposal registered: Split ₦${proposal.buyerAmount.toLocaleString()} to Madeleine / ₦${proposal.sellerAmount.toLocaleString()} to Louis`);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
    }
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
            stages={timelineStages}
            currentStage={demoState === "RELEASE_PENDING" || demoState === "REFUND_ACCEPTED" ? 4 : 3}
            totalStages={4}
          />

          {/* Dynamic Evidence Chat */}
          <EvidenceChat
            evidenceItems={getCombinedMessages()}
            onSendMessage={sendMessage}
            onProposeSettlement={() => setIsModalOpen(true)}
          />
        </div>

        {/* Right Sidebar */}
        <div className="lg:sticky lg:top-4">
          <CompromiseLedgerSidebar
            onDraftOffer={() => setIsModalOpen(true)}
            onSpeedUpDesk={() => console.log("Speed up broker desk clicked")}
            proposals={getProposals()}
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
