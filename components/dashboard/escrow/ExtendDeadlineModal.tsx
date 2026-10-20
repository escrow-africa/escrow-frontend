import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { escrowApi } from "../../../api/escrow";

interface ExtendDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  onExtended?: () => void;
}

export default function ExtendDeadlineModal({ isOpen, onClose, escrowId, onExtended }: ExtendDeadlineModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState("");
  const [justification, setJustification] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setDate("");
      setJustification("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await escrowApi.extend(escrowId, date);
      toast.success("Deadline extended");
      onExtended?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to extend deadline");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] p-8 overflow-hidden zoom-in flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#EBF3FF] flex items-center justify-center mb-6">
          <Calendar size={28} className="text-[#3B82F6]" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Extend Deadline</h2>

        <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
          Request more time from the buyer. A notification will be sent for approval.
        </p>

        <div className="w-full text-left space-y-4 mb-8">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              NEW DELIVERY DATE
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20 focus:border-[#0F3D2E] transition-colors bg-gray-50/50 disabled:opacity-50"
                placeholder="dd/mm/yy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              JUSTIFICATION
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20 focus:border-[#0F3D2E] transition-colors resize-none bg-gray-50/50 disabled:opacity-50"
              placeholder="Why do you need more time?"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !date || !justification.trim()}
          className="w-full bg-[#0F3D2E] hover:bg-[#185541] disabled:bg-[#86A69A] disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors mb-4 flex justify-center items-center"
        >
          {isSubmitting ? "Sending Request..." : "Send Extension Request"}
        </button>

        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2 disabled:opacity-50"
        >
          Nevermind
        </button>
      </div>
    </div>
  );
}
