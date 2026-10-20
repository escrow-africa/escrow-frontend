import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimelineDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSuccess: () => void;
}

export default function TimelineDisputeModal({ isOpen, onClose, onBack, onSuccess }: TimelineDisputeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueType, setIssueType] = useState("Project Delay");
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setIssueType("Project Delay");
      setExplanation("");
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
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline Dispute</h2>
        
        <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
          Inform support about delays or scope changes affecting the deadline.
        </p>

        <div className="w-full text-left space-y-4 mb-8">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              TYPE OF ISSUE
            </label>
            <div className="relative">
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20 focus:border-[#0F3D2E] transition-colors bg-white disabled:opacity-50 appearance-none"
              >
                <option value="Project Delay">Project Delay</option>
                <option value="Scope Creep">Scope Creep</option>
                <option value="Technical Blocker">Technical Blocker</option>
                <option value="Communication Barrier">Communication Barrier</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              DETAILED EXPLANATION
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20 focus:border-[#0F3D2E] transition-colors resize-none bg-gray-50/50 disabled:opacity-50 placeholder-gray-400"
              placeholder="Explain the situation in detail..."
            />
          </div>
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !explanation.trim()}
          className="w-full bg-[#0F3D2E] hover:bg-[#185541] disabled:bg-[#86A69A] disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors mb-4 flex justify-center items-center"
        >
          {isSubmitting ? "Logging Dispute..." : "File Timeline Dispute"}
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
