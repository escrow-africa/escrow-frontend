import React, { useState } from "react";
import { Clock, AlertCircle, ChevronDown } from "lucide-react";

interface CancelEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CancelEscrowModal({ isOpen, onClose }: CancelEscrowModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [reason, setReason] = useState("Mutual Agreement");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    "Mutual Agreement",
    "Buyer unresponsive",
    "Unable to fulfill timeline",
    "Technical difficulty",
    "Other"
  ];

  const handleCancel = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onClose(); // Close after processing
    }, 3000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setIsProcessing(false);
      setReason("Mutual Agreement");
      setIsDropdownOpen(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-xl animate-fade-in-up text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-6 mt-2">
          {isProcessing ? (
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center text-red-500">
                <AlertCircle size={20} strokeWidth={2} />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-orange-400 flex items-center justify-center text-orange-400">
                <Clock size={20} strokeWidth={2} />
              </div>
            </div>
          )}
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Cancel Escrow?</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-[280px] mx-auto">
          Cancelling will refund the buyer and terminate the agreement . This action cannot be reversed.
        </p>

        {/* Reason Dropdown */}
        <div className="text-left mb-8 relative">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Reason for Cancellation
          </label>
          <div 
            className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl border ${isDropdownOpen ? 'border-gray-300' : 'border-gray-100'} cursor-pointer ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-sm font-medium text-gray-800">{reason}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && !isProcessing && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden py-1">
              {reasons.map((r) => (
                <div 
                  key={r}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setReason(r);
                    setIsDropdownOpen(false);
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleCancel}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              isProcessing 
                ? 'bg-red-300 text-white cursor-not-allowed' 
                : 'bg-[#E33644] text-white hover:bg-red-600 shadow-[0_4px_12px_rgba(227,54,68,0.2)]'
            }`}
          >
            {isProcessing ? 'Processing Refund...' : 'Yes, Cancel Escrow'}
          </button>
          
          <button 
            onClick={handleClose}
            disabled={isProcessing}
            className={`w-full py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Keep Transaction Active
          </button>
        </div>

      </div>
    </div>
  );
}
