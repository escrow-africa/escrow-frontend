import React, { useState, useEffect } from "react";
import { Truck, CheckCircle2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { escrowApi } from "../../../api/escrow";

type ModalState = "confirm" | "syncing" | "success";

interface MarkDeliveredModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  onDelivered?: () => void;
}

export default function MarkDeliveredModal({ isOpen, onClose, escrowId, onDelivered }: MarkDeliveredModalProps) {
  const [modalState, setModalState] = useState<ModalState>("confirm");
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setModalState("confirm");
      setProofFile(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!proofFile) {
      toast.error("Upload proof of delivery to continue");
      return;
    }

    setModalState("syncing");
    try {
      await escrowApi.deliver(escrowId, proofFile);
      setModalState("success");
      onDelivered?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to mark escrow as delivered");
      setModalState("confirm");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => modalState !== "syncing" && onClose()}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] p-8 overflow-hidden zoom-in flex flex-col items-center text-center">

        {modalState === "confirm" && (
          <div className="flex flex-col items-center w-full animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6">
              <Truck size={24} className="text-[#0F3D2E]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Deliver?</h2>

            <p className="text-sm text-gray-500 mb-6 max-w-[280px]">
              Once you mark as delivered, the buyer's review period begins. Upload proof of delivery to continue.
            </p>

            <label className="w-full border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-2xl p-4 text-center transition-colors cursor-pointer bg-white mb-6 block">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
              />
              <Upload size={18} className="text-gray-500 mx-auto mb-2" />
              <span className="text-xs font-semibold text-gray-700 block truncate">
                {proofFile ? proofFile.name : "Click to upload proof of delivery"}
              </span>
            </label>

            <button
              onClick={handleConfirm}
              disabled={!proofFile}
              className="w-full bg-[#0F3D2E] hover:bg-[#185541] disabled:bg-[#86A69A] disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors mb-4"
            >
              Yes, Everything's Ready
            </button>

            <button
              onClick={onClose}
              className="w-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2"
            >
              Wait, let me double check
            </button>
          </div>
        )}

        {modalState === "syncing" && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 animate-pulse">
              Syncing Escrow Records...
            </h2>
          </div>
        )}

        {modalState === "success" && (
          <div className="flex flex-col items-center w-full animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6">
              <CheckCircle2 size={24} className="text-[#00A859]" />
            </div>

            <h2 className="text-2xl font-bold text-[#00A859] mb-3">Sync Complete</h2>

            <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
              Buyer has been notified via email and platform notification.
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
