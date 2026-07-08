"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, MessageSquare, Lock } from "lucide-react";
import DisputeTimeline from "../../../../components/dashboard/disputes/DisputeTimeline";
import EvidenceChat, {
  EvidenceItemData,
} from "../../../../components/dashboard/disputes/EvidenceChat";
import CompromiseLedgerSidebar from "../../../../components/dashboard/disputes/CompromiseLedgerSidebar";
import { Dispute } from "../../../../types/disputes";

// Mock dispute data
const mockDisputeData: Record<string, Dispute> = {
  "DSP-001": {
    id: "DSP-001",
    issueId: "DIS-593",
    orderRef: "BUY-883",
    date: "2026-06-21",
    title: "Buggy Deliverables",
    description: "Figma grids are broken when imported into production tailwind components.",
    amount: "₦79,000",
    status: "INVESTIGATION_ACTIVE",
    claimStatement:
      "Figma grids are broken when imported into production tailwind components.",
    breachCategory: "Quality Issue",
    relatedContract: "BUY-723",
    timelineStage: "MEDIATION_ACTIVE",
    currentStageNumber: 3,
    totalStages: 4,
  },
};

const MOCK_EVIDENCE: EvidenceItemData[] = [
  {
    id: "EV-001",
    type: "message",
    sender: "Louis Client",
    senderInitial: "L",
    timestamp: "2026-06-21 • 08:18",
    content:
      "Louis Client uploaded verified evidence package. Flaws-ui.png",
    isUserMessage: false,
  },
  {
    id: "EV-002",
    type: "file",
    sender: "Louis Client",
    senderInitial: "L",
    timestamp: "2026-06-21 • 08:18",
    fileName: "Flaws-ui.png",
    fileStatus: "ANCHORED",
    isUserMessage: false,
  },
  {
    id: "EV-003",
    type: "message",
    sender: "Louis Client",
    senderInitial: "L",
    timestamp: "2026-06-21 • 08:18",
    content:
      "The evidences as regards to this project has been dropped.",
    isUserMessage: false,
  },
  {
    id: "EV-004",
    type: "message",
    sender: "Madeleine Nkiru",
    senderInitial: "M",
    timestamp: "2026-06-21 • 08:30",
    content:
      "I have received your comment. Please let me know what exact changes",
    isUserMessage: true,
  },
];

const TIMELINE_STAGES = [
  { title: "COMPLAINT RAISED", status: "completed" as const },
  { title: "EVIDENCE LOADED", status: "completed" as const },
  { title: "MEDIATION ACTIVE", status: "current" as const },
  { title: "SETTLEMENT SETTLED", status: "upcoming" as const },
];

export default function DisputeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<"details" | "investigation">(
    "details"
  );
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItemData[]>(
    MOCK_EVIDENCE
  );

  const dispute = mockDisputeData[id] || mockDisputeData["DSP-001"];

  const handleSendMessage = (message: string) => {
    const newMessage: EvidenceItemData = {
      id: `EV-${evidenceItems.length + 1}`,
      type: "message",
      sender: "You",
      senderInitial: "Y",
      timestamp: new Date().toLocaleString(),
      content: message,
      isUserMessage: true,
    };
    setEvidenceItems([...evidenceItems, newMessage]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Disputes</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "details"
              ? "text-[#0F3D2E] border-[#0F3D2E]"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          ACTIVE CASE DETAILS
        </button>
        <button
          onClick={() => setActiveTab("investigation")}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "investigation"
              ? "text-[#0F3D2E] border-[#0F3D2E]"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          INVESTIGATION ACTIVE
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "details" ? (
            <>
              {/* Case Header */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md mb-2">
                      ACTIVE CASE DETAILS
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {dispute.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                      Ledger ID: ARB-562 | Order: {dispute.orderRef}
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-red-500">
                    {dispute.amount}
                  </p>
                </div>

                {/* Claim Statement */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Claim Statement
                  </p>
                  <p className="text-sm text-gray-700">
                    "{dispute.claimStatement}"
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <DisputeTimeline
                stages={TIMELINE_STAGES}
                currentStage={dispute.currentStageNumber}
                totalStages={dispute.totalStages}
              />

              {/* Evidence Chat */}
              <EvidenceChat
                evidenceItems={evidenceItems}
                onSendMessage={handleSendMessage}
              />
            </>
          ) : (
            /* Investigation Tab */
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Investigation Progress
              </h2>
              <p className="text-sm text-gray-600">
                Investigation details and timeline will appear here as the dispute progresses.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div>
          <CompromiseLedgerSidebar
            onDraftOffer={() => console.log("Draft offer")}
            onSpeedUpDesk={() => console.log("Speed up desk")}
          />
        </div>
      </div>
    </div>
  );
}
