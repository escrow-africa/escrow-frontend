"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, DollarSign } from "lucide-react";
import { escrowApi } from "../../../api/escrow";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ModalState = "confirm" | "processing" | "success";

interface MarkCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  escrowAmount: number;
  onCompleted?: () => void;
}

export default function MarkCompletedModal({
  isOpen,
  onClose,
  escrowId,
  escrowAmount,
  onCompleted,
}: MarkCompletedModalProps) {
  const [modalState, setModalState] = useState<ModalState>("confirm");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) setModalState("confirm");
  }, [isOpen]);

  const handleConfirm = async () => {
    setModalState("processing");
    try {
      await escrowApi.complete(escrowId);
      setModalState("success");
      onCompleted?.();
    } catch (err: any) {
      const message: string = err?.response?.data?.message || err?.message || "";
      if (message === "INSUFFICIENT_FUNDS" || message.toLowerCase().includes("insufficient")) {
        toast.error("Your wallet balance is insufficient. Please fund your wallet first.");
        onClose();
        router.push(
          `/dashboard/wallet/fund?escrowId=${escrowId}&amount=${escrowAmount}&returnTo=/dashboard/escrows/${escrowId}`
        );
      } else {
        toast.error(message || "Failed to release funds. Please try again.");
        setModalState("confirm");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => modalState !== "processing" && onClose()}
      />

      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center text-center">

        {modalState === "confirm" && (
          <div className="flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6">
              <DollarSign size={24} className="text-[#0F3D2E]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Release Funds?</h2>

            <p className="text-sm text-gray-500 mb-2 max-w-[300px]">
              By confirming, you&rsquo;re approving the delivery and releasing{" "}
              <span className="font-bold text-gray-800">₦{escrowAmount?.toLocaleString()}</span> to the seller.
            </p>
            <p className="text-xs text-gray-400 mb-8 max-w-[280px]">
              This action cannot be undone. Make sure you&rsquo;re satisfied with the delivery.
            </p>

            <button
              onClick={handleConfirm}
              className="w-full bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors mb-3"
            >
              Yes, Release Funds
            </button>

            <button
              onClick={onClose}
              className="w-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        )}

        {modalState === "processing" && (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-bold text-gray-900 animate-pulse">Releasing Funds...</h2>
            <p className="text-sm text-gray-400 mt-3">Please don&rsquo;t close this window.</p>
          </div>
        )}

        {modalState === "success" && (
          <div className="flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6">
              <CheckCircle2 size={24} className="text-[#00A859]" />
            </div>

            <h2 className="text-2xl font-bold text-[#00A859] mb-3">Funds Released!</h2>

            <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
              The escrow is now complete. The seller has been credited and notified.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
