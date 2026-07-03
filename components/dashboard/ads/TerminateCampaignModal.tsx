"use client";

import React from "react";
import SuccessModal from "@/components/SuccessModal";

interface Props {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
}

export default function TerminateCampaignModal({ isOpen, isLoading = false, onClose, onConfirm, title = "Cancel Campaign?", description }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11v6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 11v6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
        <p className="text-sm text-[#667171] mb-6">{description || 'Are you sure you want to terminate this campaign? This will close all active placements and return unburned budgets back to your balance wallet.'}</p>

        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-6 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold">Back</button>
          <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">{isLoading ? 'Cancelling...' : 'Cancel Now'}</button>
        </div>
      </div>
    </div>
  );
}
