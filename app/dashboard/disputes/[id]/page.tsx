"use client";

import React, { useState, use, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DisputeTimeline from "../../../../components/dashboard/disputes/DisputeTimeline";
import EvidenceChat from "../../../../components/dashboard/disputes/EvidenceChat";
import CompromiseLedgerSidebar, { ProposalItem } from "../../../../components/dashboard/disputes/CompromiseLedgerSidebar";
import CompromiseOfferModal from "../../../../components/dashboard/disputes/CompromiseOfferModal";
import { useDisputeChat } from "../../../../hooks/useDisputeChat";
import { disputeApi } from "../../../../api/dispute";
import { escrowApi } from "../../../../api/escrow";
import { getTokenFromCookie } from "../../../../utils/token";

function getCurrentUserId(): string | null {
  const token = getTokenFromCookie();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || decoded.id || null;
  } catch {
    return null;
  }
}

export default function DisputeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const currentUserId = getCurrentUserId();

  const [dispute, setDispute] = useState<any | null>(null);
  const [escrow, setEscrow] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [eventsTotal, setEventsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRespondingToOffer, setIsRespondingToOffer] = useState(false);
  const [isProposing, setIsProposing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestingReview, setIsRequestingReview] = useState(false);

  const isBuyer = currentUserId === escrow?.buyerId;
  const counterparty = isBuyer ? escrow?.seller : escrow?.buyer;

  const { messages, sendMessage, hasMore, isLoadingMore, loadOlder } = useDisputeChat(
    id,
    currentUserId,
    counterparty?.name || "Other Party"
  );

  const loadDispute = useCallback(async () => {
    try {
      const data = await disputeApi.getById(id);
      setDispute(data);

      const contractId = data.relatedContractId || data.relatedContract;
      if (contractId) {
        try {
          const escrowData = await escrowApi.getById(contractId);
          setEscrow(escrowData);
        } catch {
          // Escrow lookup is best-effort context (buyer/seller names, amount); dispute still loads without it.
        }
      }

      // Fetches the events endpoint's default page (most recent 100) - see the backend comment
      // on DisputeService.getEvents for why this list isn't split across true pagination pages.
      const eventsResponse: any = await disputeApi.getEvents(id);
      const eventList: any[] = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse?.data || [];
      setEvents(eventList);
      setEventsTotal(typeof eventsResponse?.total === 'number' ? eventsResponse.total : eventList.length);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load dispute details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadDispute();
  }, [loadDispute]);

  const buyerName = isBuyer ? "You" : counterparty?.name || "Buyer";
  const sellerName = !isBuyer ? "You" : counterparty?.name || "Seller";

  // Resolve pending settlement proposals: a SETTLEMENT_PROPOSED event with no later
  // SETTLEMENT_ACCEPTED/DECLINED event referencing it as acceptedProposalId/declinedProposalId.
  const respondedProposalIds = new Set(
    events
      .filter((e) => e.eventType === "SETTLEMENT_ACCEPTED" || e.eventType === "SETTLEMENT_DECLINED")
      .map((e) => e.payload?.acceptedProposalId || e.payload?.declinedProposalId)
      .filter(Boolean)
  );

  const proposals: ProposalItem[] = events
    .filter((e) => e.eventType === "SETTLEMENT_PROPOSED")
    .map((e) => {
      const isMine = e.triggeredBy === currentUserId;
      const accepted = events.find((ev) => ev.eventType === "SETTLEMENT_ACCEPTED" && ev.payload?.acceptedProposalId === e.id);
      const declined = events.find((ev) => ev.eventType === "SETTLEMENT_DECLINED" && ev.payload?.declinedProposalId === e.id);
      return {
        id: e.id,
        status: accepted ? "ACCEPTED" : declined ? "DECLINED" : "PENDING",
        proposedByLabel: isMine ? "You" : counterparty?.name || "Other party",
        isMine,
        createdAt: e.createdAt,
      } as ProposalItem;
    })
    .reverse();

  const hasPendingProposal = proposals.some((p) => p.status === "PENDING");

  const handleDraftOffer = () => {
    setIsModalOpen(true);
  };

  const handleSendProposal = async (message: string) => {
    setIsProposing(true);
    try {
      await disputeApi.proposeSettlement(id);
      await sendMessage(`Settlement proposal: ${message}`);
      toast.success("Settlement proposal sent");
      setIsModalOpen(false);
      await loadDispute();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send settlement proposal");
    } finally {
      setIsProposing(false);
    }
  };

  const handleAccept = async (proposalId: string) => {
    setIsRespondingToOffer(true);
    try {
      await disputeApi.acceptSettlement(id, proposalId);
      toast.success("Settlement accepted");
      await loadDispute();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to accept settlement");
    } finally {
      setIsRespondingToOffer(false);
    }
  };

  const handleDecline = async (proposalId: string) => {
    setIsRespondingToOffer(true);
    try {
      await disputeApi.declineSettlement(id, proposalId);
      toast.success("Settlement declined");
      await loadDispute();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to decline settlement");
    } finally {
      setIsRespondingToOffer(false);
    }
  };

  const handleSpeedUpDesk = async () => {
    setIsRequestingReview(true);
    try {
      await disputeApi.requestReview(id);
      toast.success("Manual review requested — a broker will pick up this case");
      await loadDispute();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to request review");
    } finally {
      setIsRequestingReview(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading dispute details…</p>;
  }

  if (error || !dispute) {
    return <p className="text-sm text-red-600">{error || "Unable to load this dispute"}</p>;
  }

  const isResolved = dispute.status === "RESOLVED" || dispute.status === "REJECTED";
  const timelineStages = [
    { title: "CONFLICT RAISED", status: "completed" as const },
    { title: "EVIDENCE LOCKED", status: "completed" as const },
    {
      title: "MEDIATION ACTIVE",
      status: isResolved ? "completed" as const : "current" as const,
    },
    {
      title: "AGREEMENT SETTLED",
      status: isResolved
        ? "completed" as const
        : hasPendingProposal
        ? "current" as const
        : "upcoming" as const,
    },
  ];

  return (
    <div className="relative space-y-6 pb-12">
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
                    {isResolved ? "CASE RESOLVED" : "ACTIVE CASE DETAIL"}
                  </span>
                  <span className="inline-block px-2 py-0.5 bg-[#FFFBEB] border border-[#FEF3C7] text-[#D97706] text-[10px] font-bold rounded uppercase tracking-wider">
                    {dispute.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {dispute.claimDescription || "Dispute case"}
                </h2>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  Order: {escrow?.escrowCode || dispute.relatedContractId || "N/A"}
                </p>
              </div>

              {/* Contested Amount Card */}
              <div className="bg-[#FFF5F5] border border-[#FFE3E3] rounded-xl px-4 py-2.5 text-center min-w-[130px] shrink-0">
                <p className="text-[9px] font-bold text-[#C53030] tracking-wider mb-1 uppercase">
                  CONTESTED AMOUNT
                </p>
                <p className="text-lg font-bold text-[#E53E3E]">
                  {dispute.disputedAmount ? `₦${Number(dispute.disputedAmount).toLocaleString()}` : "—"}
                </p>
              </div>
            </div>

            {/* Claim Statement */}
            <div className="mt-6 p-4 bg-[#FAFBFA] border border-gray-100 rounded-xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                CLAIM STATEMENT
              </p>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                "{dispute.claimDescription}"
              </p>
            </div>
          </div>

          {/* Timeline progress */}
          <DisputeTimeline
            stages={timelineStages}
            currentStage={isResolved ? 4 : hasPendingProposal ? 4 : 3}
            totalStages={4}
          />

          {/* Evidence Chat */}
          <EvidenceChat
            evidenceItems={messages}
            onSendMessage={sendMessage}
            onProposeSettlement={handleDraftOffer}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadOlder}
          />
        </div>

        {/* Right Sidebar */}
        <div className="lg:sticky lg:top-4">
          <CompromiseLedgerSidebar
            onDraftOffer={handleDraftOffer}
            onSpeedUpDesk={handleSpeedUpDesk}
            proposals={proposals}
            onAccept={handleAccept}
            onDecline={handleDecline}
            isResponding={isRespondingToOffer || isRequestingReview}
            truncatedNotice={eventsTotal > events.length ? `Showing the most recent ${events.length} of ${eventsTotal} case events` : undefined}
          />
        </div>
      </div>

      {/* Compromise Offer Modal */}
      <CompromiseOfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendProposal={handleSendProposal}
        isSubmitting={isProposing}
        disputedAmount={Number(dispute.disputedAmount) || 0}
        buyerName={buyerName}
        sellerName={sellerName}
      />
    </div>
  );
}
