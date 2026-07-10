"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface CompromiseOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendProposal: (proposal: {
    type: "split" | "refund" | "release";
    buyerAmount: number;
    sellerAmount: number;
    ratio: string;
  }) => void;
}

export default function CompromiseOfferModal({
  isOpen,
  onClose,
  onSendProposal,
}: CompromiseOfferModalProps) {
  const [selectedTab, setSelectedTab] = useState<"split" | "refund" | "release">("split");
  const [sliderValue, setSliderValue] = useState(50); // 50% split default
  const TOTAL_COLLATERAL = 79000;

  if (!isOpen) return null;

  // Calculations
  const buyerAmount = Math.round(TOTAL_COLLATERAL * (sliderValue / 100));
  const sellerAmount = TOTAL_COLLATERAL - buyerAmount;

  const handleSend = () => {
    let finalBuyer = 0;
    let finalSeller = 0;
    let ratio = "50% / 50%";

    if (selectedTab === "split") {
      finalBuyer = buyerAmount;
      finalSeller = sellerAmount;
      ratio = `${sliderValue}% / ${100 - sliderValue}%`;
    } else if (selectedTab === "refund") {
      finalBuyer = TOTAL_COLLATERAL;
      finalSeller = 0;
      ratio = "100% / 0%";
    } else if (selectedTab === "release") {
      finalBuyer = 0;
      finalSeller = TOTAL_COLLATERAL;
      ratio = "0% / 100%";
    }

    onSendProposal({
      type: selectedTab,
      buyerAmount: finalBuyer,
      sellerAmount: finalSeller,
      ratio,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-[420px] p-6 shadow-2xl relative z-10 border border-gray-50 flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 mt-1">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            Draft Escrow Compromise Offer
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed max-w-[280px] mx-auto">
            Propose a financial division of the secured locked collateral to settle this dispute.
          </p>
        </div>

        {/* Settlement Structure Tabs */}
        <div className="mb-5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            SETTLEMENT STRUCTURE
          </label>
          <div className="flex gap-2 bg-gray-50/50 p-1 border border-gray-100 rounded-xl">
            <button
              onClick={() => setSelectedTab("split")}
              className={`flex-1 text-[11px] font-bold py-2.5 px-2 rounded-lg transition-all text-center ${
                selectedTab === "split"
                  ? "bg-[#0F3D2E] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              Split Funds
            </button>
            <button
              onClick={() => setSelectedTab("refund")}
              className={`flex-1 text-[11px] font-bold py-2.5 px-2 rounded-lg transition-all text-center ${
                selectedTab === "refund"
                  ? "bg-[#0F3D2E] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              100% Refund
            </button>
            <button
              onClick={() => setSelectedTab("release")}
              className={`flex-1 text-[11px] font-bold py-2.5 px-2 rounded-lg transition-all text-center ${
                selectedTab === "release"
                  ? "bg-[#0F3D2E] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              100% Release
            </button>
          </div>
        </div>

        {/* Tab-specific Content */}
        <div className="min-h-[145px] flex flex-col justify-center mb-6">
          {selectedTab === "split" && (
            <div className="space-y-4 w-full">
              {/* Ratio Header */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  DIVISION RATIO
                </span>
                <span className="text-xs font-bold text-[#0F3D2E] bg-green-50 border border-green-100 px-2 py-0.5 rounded-md">
                  {sliderValue}% / {100 - sliderValue}%
                </span>
              </div>

              {/* Slider */}
              <div className="py-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0F3D2E]"
                />
              </div>

              {/* Share Breakdown */}
              <div className="grid grid-cols-2 gap-4 border border-gray-50 rounded-2xl p-4 bg-gray-50/20">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    BUYER (MADELEINE NKIRU)
                  </p>
                  <p className="text-base font-bold text-[#E53E3E]">
                    ₦{buyerAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-center border-l border-gray-100">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    LOUIS IDUNDUN (SELLER)
                  </p>
                  <p className="text-base font-bold text-green-600">
                    ₦{sellerAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "refund" && (
            <div className="bg-[#FFF5F5] border border-[#FFE3E3] rounded-2xl p-4 flex gap-3 items-start w-full">
              <AlertCircle size={16} className="text-[#E53E3E] fill-white flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[#C53030] uppercase tracking-wider block mb-1">
                  TOTAL REFUND SELECTED
                </span>
                <p className="text-[11px] text-[#9B4040] leading-relaxed font-semibold">
                  This will award the entire locked collateral of ₦{TOTAL_COLLATERAL.toLocaleString()}.00 back to Madeleine Nkiru. Louis Idundun receives ₦0.00.
                </p>
              </div>
            </div>
          )}

          {selectedTab === "release" && (
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 flex gap-3 items-start w-full">
              <AlertCircle size={16} className="text-[#059669] fill-white flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider block mb-1">
                  TOTAL RELEASE SELECTED
                </span>
                <p className="text-[11px] text-[#047857] leading-relaxed font-semibold">
                  This will release the entire locked collateral of ₦{TOTAL_COLLATERAL.toLocaleString()}.00 to Louis Idundun. Madeleine Nkiru receives ₦0.00.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-800 rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 transition-colors text-center cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="flex-1 px-4 py-3 bg-[#0F3D2E] hover:bg-[#185541] text-white rounded-xl font-bold text-xs shadow-sm transition-colors text-center cursor-pointer"
          >
            Send Proposal
          </button>
        </div>
      </div>
    </div>
  );
}
