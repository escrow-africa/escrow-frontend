import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TechnicalIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSuccess: () => void;
}

export default function TechnicalIssueModal({ isOpen, onClose, onBack, onSuccess }: TechnicalIssueModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reproductionSteps, setReproductionSteps] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setReproductionSteps("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 2500);
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
        <div className="w-16 h-16 rounded-full bg-[#FFF4E5] flex items-center justify-center mb-6">
          <Clock size={28} className="text-[#F5A623]" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Technical Issue</h2>
        
        <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
          Report bugs in the delivery or review system affecting this transaction.
        </p>

        <div className="w-full text-left mb-8">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            REPRODUCTION STEPS
          </label>
          <textarea
            value={reproductionSteps}
            onChange={(e) => setReproductionSteps(e.target.value)}
            disabled={isSubmitting}
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20 focus:border-[#0F3D2E] transition-colors resize-none bg-gray-50/50 disabled:opacity-50 placeholder-gray-400"
            placeholder="What were you doing when the error occured?"
          />
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !reproductionSteps.trim()}
          className="w-full bg-[#0F3D2E] hover:bg-[#185541] disabled:bg-[#86A69A] disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors mb-4 flex justify-center items-center"
        >
          {isSubmitting ? "Analyzing System..." : "Report Technical Error"}
        </button>
        
        <button 
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2 disabled:opacity-50"
        >
          Back to Support
        </button>
      </div>
    </div>
  );
}
