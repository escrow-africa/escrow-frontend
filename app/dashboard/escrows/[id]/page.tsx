"use client";

import React, { useState } from "react";
import { Download, ShieldCheck, CheckCircle2, MessageSquare, FileText, AlertCircle, ChevronRight, HelpCircle } from "lucide-react";
import EscrowTimeline, { TimelineStep } from "../../../../components/dashboard/escrow/EscrowTimeline";
import MarkDeliveredModal from "../../../../components/dashboard/escrow/MarkDeliveredModal";
import ExtendDeadlineModal from "../../../../components/dashboard/escrow/ExtendDeadlineModal";
import TransactionSupportModal from "../../../../components/dashboard/escrow/TransactionSupportModal";
import VerifyFundsModal from "../../../../components/dashboard/escrow/VerifyFundsModal";
import TimelineDisputeModal from "../../../../components/dashboard/escrow/TimelineDisputeModal";
import TechnicalIssueModal from "../../../../components/dashboard/escrow/TechnicalIssueModal";
import SupportTicketOpenedModal from "../../../../components/dashboard/escrow/SupportTicketOpenedModal";
import EscrowDetailsDropdown from "../../../../components/dashboard/escrow/EscrowDetailsDropdown";

export default function EscrowDetailsPage({ params }: { params: { id: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isVerifyFundsModalOpen, setIsVerifyFundsModalOpen] = useState(false);
  const [isTimelineDisputeModalOpen, setIsTimelineDisputeModalOpen] = useState(false);
  const [isTechnicalIssueModalOpen, setIsTechnicalIssueModalOpen] = useState(false);
  const [isTicketOpenedModalOpen, setIsTicketOpenedModalOpen] = useState(false);

  // Mock data tailored to the screenshot
  const timelineSteps: TimelineStep[] = [
    { title: "Escrow Created", date: "Mar 20, 2026", status: "completed" },
    { title: "Funds Deposited", date: "Mar 22, 2026", status: "completed" },
    { title: "Awaiting Delivery", date: "Mar 30, 2026", status: "current" },
  ];

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
                <div className="w-14 h-14 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-xl font-bold text-[#0F3D2E]">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                      <ShieldCheck size={10} />
                      SECURED
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-0.5">Madeleine Nkiru</h2>
                  <p className="text-xs text-gray-400 font-medium">TRANSACTION ID: #ESC-101</p>
                </div>
              </div>
              <div className="text-right bg-[#F8FAF9] px-5 py-3 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Locked Funds</p>
                <p className="text-2xl font-bold text-[#0F3D2E]">₦52,150</p>
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
                  <span className="text-sm font-bold text-gray-900">Logo Design Service</span>
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
                    <span className="text-sm font-bold text-gray-900">₦52,150</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Platform Fee (1.5%)</span>
                    <span className="text-sm font-bold text-red-500">-₦1,050</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Your Payout</span>
                    <span className="text-lg font-bold text-[#00A859]">₦51,100.00</span>
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
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex justify-center items-center gap-2 bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors mb-4"
            >
              <div className="relative -top-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              Mark as Delivered
            </button>
            
            <div className="grid grid-cols-2 gap-4 w-full mb-6 pb-6 border-b border-gray-100">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <MessageSquare size={18} className="text-gray-600" />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Chat</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
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
            className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gray-200 transition-colors"
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
      <MarkDeliveredModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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
    </div>
  );
}
