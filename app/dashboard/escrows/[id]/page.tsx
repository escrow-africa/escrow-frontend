"use client";

import { useState, use, useEffect } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { escrowApi } from "../../../../api/escrow";
import { authApi } from "../../../../api/auth";
import {
  Download, ShieldCheck, CheckCircle2, MessageSquare, FileText,
  AlertCircle, ChevronRight, HelpCircle, Lock, Truck, Bell,
} from "lucide-react";
import EscrowDetailsDropdown from "../../../../components/dashboard/escrow/EscrowDetailsDropdown";

// Lazy-load modals so they don't bloat the initial page bundle
const MarkDeliveredModal = dynamic(() => import("../../../../components/dashboard/escrow/MarkDeliveredModal"), { ssr: false });
const MarkCompletedModal = dynamic(() => import("../../../../components/dashboard/escrow/MarkCompletedModal"), { ssr: false });
const ExtendDeadlineModal = dynamic(() => import("../../../../components/dashboard/escrow/ExtendDeadlineModal"), { ssr: false });
const TransactionSupportModal = dynamic(() => import("../../../../components/dashboard/escrow/TransactionSupportModal"), { ssr: false });
const VerifyFundsModal = dynamic(() => import("../../../../components/dashboard/escrow/VerifyFundsModal"), { ssr: false });
const TimelineDisputeModal = dynamic(() => import("../../../../components/dashboard/escrow/TimelineDisputeModal"), { ssr: false });
const TechnicalIssueModal = dynamic(() => import("../../../../components/dashboard/escrow/TechnicalIssueModal"), { ssr: false });
const SupportTicketOpenedModal = dynamic(() => import("../../../../components/dashboard/escrow/SupportTicketOpenedModal"), { ssr: false });
const LegalAgreementModal = dynamic(() => import("../../../../components/dashboard/escrow/LegalAgreementModal"), { ssr: false });
const CancelEscrowModal = dynamic(() => import("../../../../components/dashboard/escrow/CancelEscrowModal"), { ssr: false });
const ProofOfDeliveryModal = dynamic(() => import("../../../../components/dashboard/escrow/ProofOfDeliveryModal"), { ssr: false });

export default function EscrowDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [fetchedEscrow, setFetchedEscrow] = useState<any>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMarkDeliveredOpen, setIsMarkDeliveredOpen] = useState(false);
  const [isMarkCompletedOpen, setIsMarkCompletedOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isVerifyFundsModalOpen, setIsVerifyFundsModalOpen] = useState(false);
  const [isTimelineDisputeModalOpen, setIsTimelineDisputeModalOpen] = useState(false);
  const [isTechnicalIssueModalOpen, setIsTechnicalIssueModalOpen] = useState(false);
  const [isTicketOpenedModalOpen, setIsTicketOpenedModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isNudging, setIsNudging] = useState(false);

  const loadEscrow = async (id: string) => {
    try {
      const [detailRes, meRes] = await Promise.all([
        escrowApi.getById(id),
        authApi.getMe(),
      ]);

      const userId = meRes?.id || meRes?.userId || null;
      setCurrentUserId(userId);

      const mapped: any = {
        id: detailRes.escrowId || detailRes.id || detailRes._id || id,
        status: detailRes.status,
        customerName: detailRes.buyer?.name || detailRes.seller?.name || "Unknown",
        customerInitial: (detailRes.buyer?.name || detailRes.seller?.name || "?").charAt(0).toUpperCase(),
        lockedFunds: detailRes.amount,
        milestones: detailRes.milestones,
        baseAmount: detailRes.amount,
        payout: detailRes.amount - 0.015 * detailRes.amount,
        sellerId: detailRes.sellerId,
        buyerId: detailRes.buyerId,
        proofUrl: detailRes.proofUrl || null,
        deliveredAt: detailRes.deliveredAt || null,
      };

      setFetchedEscrow(mapped);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to load escrow details");
    }
  };

  useEffect(() => {
    const fetchEscrow = async () => {
      console.log("Fetching escrow with ID:", unwrappedParams.id);
      await loadEscrow(unwrappedParams.id);
    };

    fetchEscrow();
  }, [unwrappedParams.id]);

  const isSeller = Boolean(currentUserId && fetchedEscrow?.sellerId && currentUserId === fetchedEscrow.sellerId);
  const isBuyer = Boolean(currentUserId && fetchedEscrow?.buyerId && currentUserId === fetchedEscrow.buyerId);
  const isUnderReview = fetchedEscrow.status === "UNDER_REVIEW";
  const isFundedOrInProgress = fetchedEscrow.status === "FUNDED" || fetchedEscrow.status === "IN_PROGRESS" || fetchedEscrow.status === "PENDING_PAYMENT";

  const handleNudge = async () => {
    setIsNudging(true);
    try {
      await escrowApi.nudge(fetchedEscrow.id);
      toast.success("Buyer has been nudged!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to nudge buyer.");
    } finally {
      setIsNudging(false);
    }
  };

  const getStatusDisplay = () => {
    switch (fetchedEscrow.status) {
      case "RELEASED": return { label: "RELEASED", color: "bg-green-50 text-green-600", icon: <CheckCircle2 size={10} className="mr-0.5" /> };
      case "COMPLETED": return { label: "COMPLETED", color: "bg-green-50 text-green-600", icon: <CheckCircle2 size={10} className="mr-0.5" /> };
      case "DISPUTED": return { label: "IN DISPUTE", color: "bg-red-50 text-red-600", icon: <AlertCircle size={10} className="mr-0.5" /> };
      case "UNDER_REVIEW": return { label: "IN REVIEW", color: "bg-orange-50 text-orange-600", icon: <Truck size={10} className="mr-0.5" /> };
      case "FUNDED": return { label: "SECURED", color: "bg-blue-50 text-blue-600", icon: <ShieldCheck size={10} /> };
      case "IN_PROGRESS": return { label: "IN PROGRESS", color: "bg-blue-50 text-blue-600", icon: <ShieldCheck size={10} /> };
      default: return { label: "PENDING", color: "bg-gray-50 text-gray-500", icon: null };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="flex flex-col h-full fade-in pb-12 max-w-6xl mx-auto">

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D2E]">Escrows</h1>
        </div>
        <div className="flex items-center gap-3">
          <EscrowDetailsDropdown
            onExtendDeadline={() => setIsExtendModalOpen(true)}
            onSupport={() => setIsSupportModalOpen(true)}
            onViewContract={() => setIsLegalModalOpen(true)}
            onCancelEscrow={() => setIsCancelModalOpen(true)}
          />
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={16} />
            Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] p-8 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">

            {/* Header Section */}
            <div className="flex justify-between items-start mb-10 pb-10 border-b border-gray-100">
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-2xl ${
                  fetchedEscrow.status === "RELEASED" || fetchedEscrow.status === "COMPLETED" ? "bg-gray-100" :
                  fetchedEscrow.status === "DISPUTED" ? "bg-red-100" : "bg-[#E6F4EA]"
                } flex items-center justify-center text-xl font-bold text-[#0F3D2E]`}>
                  {fetchedEscrow.customerInitial}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full ${statusDisplay.color} text-[10px] font-bold tracking-wider uppercase flex items-center gap-1`}>
                      {statusDisplay.icon}
                      {statusDisplay.label}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-0.5">{fetchedEscrow.customerName}</h2>
                  <p className="text-xs text-gray-400 font-medium">TRANSACTION ID: #{fetchedEscrow.id}</p>
                </div>
              </div>
              <div className="text-right bg-[#F8FAF9] px-5 py-3 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Locked Funds</p>
                <p className="text-2xl font-bold text-[#0F3D2E]">₦{fetchedEscrow.lockedFunds?.toLocaleString()}</p>
              </div>
            </div>

            {/* Milestones & Financials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

              {/* Delivery Milestones */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText size={12} />
                  Delivery Milestones
                </p>
                {fetchedEscrow.milestones && fetchedEscrow.milestones.map((item: string, index: number) => (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-[#E6F4EA] bg-[#F8FAF9] mb-2" key={index}>
                    <div className="w-6 h-6 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#00A859]">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item}</span>
                  </div>
                ))}
              </div>

              {/* Financial Overview */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="text-gray-400">↗</span>
                  Financial Overview
                </p>
                <div className="bg-[#F8FAF9] rounded-xl p-5 border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Base Amount</span>
                    <span className="text-sm font-bold text-gray-900">₦{fetchedEscrow.baseAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Platform Fee (1.5%)</span>
                    <span className="text-sm font-bold text-red-500">₦{(0.015 * fetchedEscrow.baseAmount)?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      {isBuyer ? "Total Paid" : "Your Payout"}
                    </span>
                    <span className="text-lg font-bold text-[#00A859]">₦{fetchedEscrow.payout?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Management Center */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">

          <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Management Center</h3>

            {/* UNDER REVIEW state */}
            {isUnderReview && (
              <div className="w-full bg-[#FFF9F2] border border-[#FFE8CC] rounded-xl p-5 mb-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-[#F5A623]" />
                  <h4 className="font-semibold text-[#F5A623] text-sm">Awaiting Review</h4>
                </div>
                <p className="text-xs text-[#F5A623] mb-5 leading-relaxed font-medium">
                  {isBuyer
                    ? "The seller has submitted proof of delivery. Review it and release funds when satisfied."
                    : "Buyer has been notified and has 7 days to inspect before funds are auto-released."}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsProofModalOpen(true)}
                    className="flex-1 py-2 text-xs font-bold text-[#F5A623] border border-[#F5A623] rounded-lg hover:bg-[#FFF4E5] transition-colors"
                  >
                    VIEW PROOF
                  </button>
                  {isSeller ? (
                    <button
                      onClick={handleNudge}
                      disabled={isNudging}
                      className="flex-1 py-2 text-xs font-bold text-[#B0720A] bg-[#FFE8CC] rounded-lg hover:bg-[#FFDFB3] transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
                    >
                      <Bell size={12} />
                      {isNudging ? "SENDING..." : "NUDGE BUYER"}
                    </button>
                  ) : isBuyer ? (
                    <button
                      onClick={() => setIsMarkCompletedOpen(true)}
                      className="flex-1 py-2 text-xs font-bold text-white bg-[#0F3D2E] rounded-lg hover:bg-[#185541] transition-colors"
                    >
                      MARK COMPLETE
                    </button>
                  ) : null}
                </div>
              </div>
            )}

            {/* FUNDED / IN_PROGRESS — seller can mark as delivered */}
            {isFundedOrInProgress && isSeller && (
              <button
                onClick={() => setIsMarkDeliveredOpen(true)}
                className="w-full flex justify-center items-center gap-2 bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors mb-4"
              >
                <Truck size={18} />
                Mark as Delivered
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 w-full mb-6 pb-6 border-b border-gray-100">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <MessageSquare size={18} className="text-gray-600" />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Chat</span>
              </button>
              <button
                onClick={() => setIsLegalModalOpen(true)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <FileText size={18} className="text-gray-600" />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Contract</span>
              </button>
            </div>

            <button className="flex items-center justify-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors py-2">
              <AlertCircle size={16} />
              Open Dispute
            </button>
          </div>

          {/* Buyer Protection */}
          <div className="bg-[#0B132B] rounded-[20px] p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-[#F5A623]" />
              <h3 className="font-bold">Buyer Protection</h3>
            </div>
            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
              This transaction is covered by the EscrowAfrica NG Secure Marketplace Policy. Funds will not be released until delivery is verified or the inspection period expires.
            </p>
            <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#F5A623] uppercase tracking-wider hover:text-white transition-colors">
              <AlertCircle size={12} />
              Read Protection Details
            </button>
          </div>

          {/* Help link */}
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <HelpCircle size={16} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
              Need help with this?
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <MarkDeliveredModal
        isOpen={isMarkDeliveredOpen}
        onClose={() => setIsMarkDeliveredOpen(false)}
        escrowId={fetchedEscrow.id}
        onDelivered={() => loadEscrow(unwrappedParams.id)}
      />

      <MarkCompletedModal
        isOpen={isMarkCompletedOpen}
        onClose={() => setIsMarkCompletedOpen(false)}
        escrowId={fetchedEscrow.id}
        escrowAmount={fetchedEscrow.baseAmount}
        onCompleted={() => loadEscrow(unwrappedParams.id)}
      />

      <ExtendDeadlineModal isOpen={isExtendModalOpen} onClose={() => setIsExtendModalOpen(false)} />

      <TransactionSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onSelectOption={(option) => {
          setIsSupportModalOpen(false);
          if (option === "payment_verification") {
            setTimeout(() => setIsVerifyFundsModalOpen(true), 150);
          } else if (option === "timeline_dispute") {
            setTimeout(() => setIsTimelineDisputeModalOpen(true), 150);
          } else if (option === "technical_issue") {
            setTimeout(() => setIsTechnicalIssueModalOpen(true), 150);
          }
        }}
      />

      <VerifyFundsModal
        isOpen={isVerifyFundsModalOpen}
        onClose={() => setIsVerifyFundsModalOpen(false)}
        onSuccess={() => {
          setIsVerifyFundsModalOpen(false);
          setTimeout(() => setIsTicketOpenedModalOpen(true), 150);
        }}
      />

      <TimelineDisputeModal
        isOpen={isTimelineDisputeModalOpen}
        onClose={() => setIsTimelineDisputeModalOpen(false)}
        onBack={() => {
          setIsTimelineDisputeModalOpen(false);
          setTimeout(() => setIsSupportModalOpen(true), 150);
        }}
        onSuccess={() => {
          setIsTimelineDisputeModalOpen(false);
          setTimeout(() => setIsTicketOpenedModalOpen(true), 150);
        }}
      />

      <TechnicalIssueModal
        isOpen={isTechnicalIssueModalOpen}
        onClose={() => setIsTechnicalIssueModalOpen(false)}
        onBack={() => {
          setIsTechnicalIssueModalOpen(false);
          setTimeout(() => setIsSupportModalOpen(true), 150);
        }}
        onSuccess={() => {
          setIsTechnicalIssueModalOpen(false);
          setTimeout(() => setIsTicketOpenedModalOpen(true), 150);
        }}
      />

      <SupportTicketOpenedModal
        isOpen={isTicketOpenedModalOpen}
        onClose={() => setIsTicketOpenedModalOpen(false)}
      />

      <LegalAgreementModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />

      <CancelEscrowModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      />

      <ProofOfDeliveryModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        proofUrl={fetchedEscrow.proofUrl}
        deliveredAt={fetchedEscrow.deliveredAt}
      />
    </div>
  );
}
