import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SupportTicketOpenedModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber?: string;
}

export default function SupportTicketOpenedModal({ 
  isOpen, 
  onClose,
  ticketNumber = "#ESCA-765331"
}: SupportTicketOpenedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] p-8 overflow-hidden zoom-in flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6">
          <CheckCircle2 size={28} className="text-[#00A859]" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Support Ticket Opened</h2>
        
        <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
          Our arbitration team has been notified. You will receive an update in the Support Lab within 4 hours.
        </p>

        <div className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 mb-8 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Ticket Number</span>
          <span className="text-xl text-gray-900 font-bold">{ticketNumber}</span>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          Return to Transaction
        </button>
      </div>
    </div>
  );
}
