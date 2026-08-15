"use client";

import { useState, use, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { escrowApi } from "../../../../api/escrow";
import { getTokenFromCookie } from "../../../../utils/token";
import { Download, ShieldCheck, CheckCircle2, MessageSquare, FileText, AlertCircle, ChevronRight, HelpCircle, Lock, Truck, Mail } from "lucide-react";
import EscrowTimeline, { TimelineStep } from "../../../../components/dashboard/escrow/EscrowTimeline";
import MarkDeliveredModal from "../../../../components/dashboard/escrow/MarkDeliveredModal";
import ExtendDeadlineModal from "../../../../components/dashboard/escrow/ExtendDeadlineModal";
import TransactionSupportModal from "../../../../components/dashboard/escrow/TransactionSupportModal";
import VerifyFundsModal from "../../../../components/dashboard/escrow/VerifyFundsModal";
import TimelineDisputeModal from "../../../../components/dashboard/escrow/TimelineDisputeModal";
import TechnicalIssueModal from "../../../../components/dashboard/escrow/TechnicalIssueModal";
import SupportTicketOpenedModal from "../../../../components/dashboard/escrow/SupportTicketOpenedModal";
import EscrowDetailsDropdown from "../../../../components/dashboard/escrow/EscrowDetailsDropdown";
import LegalAgreementModal from "../../../../components/dashboard/escrow/LegalAgreementModal";
import CancelEscrowModal from "../../../../components/dashboard/escrow/CancelEscrowModal";
import ProofOfDeliveryModal from "../../../../components/dashboard/escrow/ProofOfDeliveryModal";
import { useRouter } from "next/navigation";

type EscrowStatus = "RELEASED" | "IN_DISPUTE" | "SECURED" | "IN_REVIEW" | "CANCELLED" | "AWAITING_APPROVAL";

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

function formatCurrency(value: any) {
  const n = Number(value);
  if (Number.isNaN(n)) return String(value ?? "");
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(n);
}

function formatDate(value?: string | null) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "";
  }
}

function mapStatus(raw: string): EscrowStatus {
  const s = (raw || "").toUpperCase();
  if (s === "DISPUTED") return "IN_DISPUTE";
  if (s === "RELEASED" || s === "COMPLETED") return "RELEASED";
  if (s === "CANCELLED" || s === "REFUNDED" || s === "EXPIRED") return "CANCELLED";
  if (s === "UNDER_REVIEW" || s === "DELIVERED") return "IN_REVIEW";
  if (s === "PENDING_APPROVAL") return "AWAITING_APPROVAL";
  return "SECURED"; // CREATED, PENDING_PAYMENT, FUNDED, IN_PROGRESS
}

function buildTimeline(escrow: any): TimelineStep[] {
  const status = (escrow.status || "").toUpperCase();
  const order = ["CREATED", "FUNDED", "DELIVERED", "UNDER_REVIEW", "COMPLETED"];
  const terminal = ["DISPUTED", "CANCELLED", "REFUNDED", "EXPIRED"];

  const steps: TimelineStep[] = [
    { title: "Escrow Created", date: formatDate(escrow.createdAt), status: "completed" },
  ];

  const isFunded = !["CREATED", "PENDING_APPROVAL", "PENDING_PAYMENT"].includes(status);
  steps.push({
    title: "Funds Deposited",
    date: isFunded ? formatDate(escrow.updatedAt) : "",
    status: isFunded ? "completed" : status === "PENDING_PAYMENT" ? "current" : "upcoming",
  });

  const isDelivered = Boolean(escrow.deliveredAt) || ["DELIVERED", "UNDER_REVIEW", "COMPLETED", "RELEASED"].includes(status);
  steps.push({
    title: "Delivered",
    date: escrow.deliveredAt ? formatDate(escrow.deliveredAt) : "",
    status: isDelivered ? "completed" : isFunded ? "current" : "upcoming",
  });

  if (terminal.includes(status)) {
    steps.push({
      title: status === "DISPUTED" ? "Dispute Raised" : status.charAt(0) + status.slice(1).toLowerCase(),
      date: formatDate(escrow.updatedAt),
      status: "completed",
    });
  } else {
    const isReleased = ["COMPLETED", "RELEASED"].includes(status);
    steps.push({
      title: "Funds Released",
      date: isReleased ? formatDate(escrow.updatedAt) : "",
      status: isReleased ? "completed" : isDelivered ? "current" : "upcoming",
    });
  }

  return steps;
}

export default function EscrowDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [escrowRaw, setEscrowRaw] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const currentUserId = getCurrentUserId();

  const loadEscrow = useCallback(async () => {
    try {
      const detail = await escrowApi.getById(unwrappedParams.id);
      setEscrowRaw(detail);
      setLoadError(null);
    } catch (err: any) {
      setLoadError(err?.response?.data?.message || "Unable to load escrow details");
    } finally {
      setLoading(false);
    }
  }, [unwrappedParams.id]);

  useEffect(() => {
    setLoading(true);
    loadEscrow();
  }, [loadEscrow]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading escrow…</p>;
  }

  if (loadError || !escrowRaw) {
    return <p className="text-sm text-red-600">{loadError || "Escrow not found"}</p>;
  }

  const isBuyer = currentUserId === escrowRaw.buyerId;
  const isSeller = currentUserId === escrowRaw.sellerId;
  // The backend only returns the counterparty's info (buyer sees `seller`, seller sees `buyer`)
  const counterparty = isBuyer ? escrowRaw.seller : escrowRaw.buyer;
  const counterpartyName = counterparty?.name || counterparty?.email || "Counterparty";

  const status = mapStatus(escrowRaw.status);
  const milestone = Array.isArray(escrowRaw.milestones) ? escrowRaw.milestones.join(", ") : escrowRaw.description || "—";
  const timelineSteps = buildTimeline(escrowRaw);

  const escrow = {
    id: escrowRaw.escrowCode || escrowRaw.id,
    status,
    customerName: counterpartyName,
    customerInitial: (counterpartyName || "?").charAt(0).toUpperCase(),
    lockedFunds: formatCurrency(escrowRaw.amount),
    milestone,
    baseAmount: formatCurrency(escrowRaw.amount),
    // Platform fee is only computed by the backend at release time, not stored upfront -
    // show the same 1.5% estimate used at escrow creation for a reasonable preview.
    platformFee: `-${formatCurrency(Number(escrowRaw.amount) * 0.015)}`,
    payout: formatCurrency(Number(escrowRaw.amount) * 0.985),
    managementType:
      isSeller && status === "IN_REVIEW"
        ? ("awaiting-review" as const)
        : isDisputable(escrowRaw.status)
        ? ("in-dispute" as const)
        : ("awaiting-delivery" as const),
  };

  function isDisputable(rawStatus: string) {
    return rawStatus === "DISPUTED";
  }

  const handleNudge = async () => {
    setIsNudging(true);
    try {
      await escrowApi.nudge(escrowRaw.id);
      toast.success("Buyer has been nudged");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to nudge buyer");
    } finally {
      setIsNudging(false);
    }
  };

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

        {/* Left Column - Details */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

          {/* Main Info Card */}
          <div className="bg-white rounded-[20px] p-8 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">

            {/* Header Section */}
            <div className="flex justify-between items-start mb-10 pb-10 border-b border-gray-100">
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-2xl ${escrow.status === "RELEASED" ? 'bg-gray-100' : escrow.status === "IN_DISPUTE" ? 'bg-red-100' : 'bg-[#E6F4EA]'} flex items-center justify-center text-xl font-bold text-[#0F3D2E]`}>
                  {escrow.customerInitial}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full ${
                      escrow.status === "RELEASED" ? 'bg-green-50 text-green-600' :
                      escrow.status === "IN_DISPUTE" ? 'bg-red-50 text-red-600' :
                      escrow.status === "IN_REVIEW" ? 'bg-orange-50 text-orange-600' :
                      escrow.status === "CANCELLED" ? 'bg-gray-100 text-gray-500' :
                      escrow.status === "AWAITING_APPROVAL" ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-blue-600'
                    } text-[10px] font-bold tracking-wider uppercase flex items-center gap-1`}>
                      {escrow.status === "IN_DISPUTE" && <AlertCircle size={10} className="mr-0.5" />}
                      {escrow.status === "IN_REVIEW" && <Truck size={10} className="mr-0.5" />}
                      {escrow.status === "RELEASED" && <CheckCircle2 size={10} className="mr-0.5" />}
                      {escrow.status === "SECURED" && <ShieldCheck size={10} />}
                      {escrow.status === "AWAITING_APPROVAL" && <Mail size={10} className="mr-0.5" />}
                      {escrow.status === "RELEASED" ? "RELEASED" :
                       escrow.status === "IN_DISPUTE" ? "IN DISPUTE" :
                       escrow.status === "IN_REVIEW" ? "IN REVIEW" :
                       escrow.status === "CANCELLED" ? "CANCELLED" :
                       escrow.status === "AWAITING_APPROVAL" ? "AWAITING APPROVAL" :
                       "SECURED"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-0.5">{escrow.customerName}</h2>
                  <p className="text-xs text-gray-400 font-medium">TRANSACTION ID: #{escrow.id}</p>
                </div>
              </div>
              <div className="text-right bg-[#F8FAF9] px-5 py-3 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Locked Funds</p>
                <p className="text-2xl font-bold text-[#0F3D2E]">{escrow.lockedFunds}</p>
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
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#E6F4EA] bg-[#F8FAF9]">
                  <div className="w-6 h-6 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#00A859]">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{escrow.milestone}</span>
                </div>
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
                    <span className="text-sm font-bold text-gray-900">{escrow.baseAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Platform Fee (1.5%)</span>
                    <span className="text-sm font-bold text-red-500">{escrow.platformFee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Your Payout</span>
                    <span className="text-lg font-bold text-[#00A859]">{escrow.payout}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <EscrowTimeline steps={timelineSteps} />

          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">

          {/* Management Center */}
          <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Management Center</h3>

            {escrow.status === "AWAITING_APPROVAL" ? (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={16} className="text-amber-600" />
                  <h4 className="font-semibold text-amber-600 text-sm">Awaiting Buyer Approval</h4>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  {isBuyer
                    ? "We've emailed you a link to approve this escrow. Approve it to let the seller get started."
                    : "We've emailed the buyer a link to approve this escrow. You'll be notified once they approve it."}
                </p>
              </div>
            ) : escrow.managementType === "awaiting-review" ? (
              <div className="w-full bg-[#FFF9F2] border border-[#FFE8CC] rounded-xl p-5 mb-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-[#F5A623]" />
                  <h4 className="font-semibold text-[#F5A623] text-sm">Awaiting Review</h4>
                </div>
                <p className="text-xs text-[#F5A623] mb-5 leading-relaxed font-medium">
                  Buyer has {escrowRaw.inspectionPeriodDays ?? 7} days to inspect the deliverables before funds are auto-released.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsProofModalOpen(true)}
                    className="flex-1 py-2 text-xs font-bold text-[#F5A623] border border-[#F5A623] rounded-lg hover:bg-[#FFF4E5] transition-colors"
                  >
                    VIEW PROOF
                  </button>
                  <button
                    onClick={handleNudge}
                    disabled={isNudging}
                    className="flex-1 py-2 text-xs font-bold text-[#B0720A] bg-[#FFE8CC] rounded-lg hover:bg-[#FFDFB3] transition-colors disabled:opacity-50"
                  >
                    {isNudging ? "NUDGING…" : "NUDGE BUYER"}
                  </button>
                </div>
              </div>
            ) : isSeller && escrow.status === "SECURED" ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex justify-center items-center gap-2 bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors mb-4"
              >
                <div className="relative -top-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                </div>
                Mark as Delivered
              </button>
            ) : null}

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

            <button
              onClick={() => router.push(`/dashboard/disputes/create?escrowId=${escrowRaw.id}`)}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors py-2"
            >
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

      {/* Modal Flow */}
      <MarkDeliveredModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        escrowId={escrowRaw.id}
        onDelivered={loadEscrow}
      />
      <ExtendDeadlineModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        escrowId={escrowRaw.id}
        onExtended={loadEscrow}
      />
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
        escrowId={escrowRaw.id}
        onCancelled={loadEscrow}
      />

      <ProofOfDeliveryModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
      />
    </div>
  );
}
