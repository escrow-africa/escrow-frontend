import React from "react";
import { HelpCircle, ShieldCheck, Clock, Info, ChevronRight } from "lucide-react";

interface TransactionSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

export default function TransactionSupportModal({ isOpen, onClose, onSelectOption }: TransactionSupportModalProps) {
  if (!isOpen) return null;

  const supportOptions = [
    {
      id: "payment_verification",
      icon: <ShieldCheck size={20} className="text-[#00A859]" />,
      title: "Payment Verification",
      description: "Confirm if buyer funds have been fully cleared.",
    },
    {
      id: "timeline_dispute",
      icon: <Clock size={20} className="text-[#00A859]" />,
      title: "Timeline Dispute",
      description: "Inform support about delays or scope changes.",
    },
    {
      id: "technical_issue",
      icon: <Info size={20} className="text-[#00A859]" />,
      title: "Technical Issue",
      description: "Report bugs in the delivery or review system.",
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[440px] p-8 overflow-hidden zoom-in flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6 border-4 border-white shadow-sm">
          <HelpCircle size={28} className="text-[#00A859]" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Support</h2>
        
        <p className="text-sm text-gray-500 mb-6 max-w-[320px]">
          Need help with this escrow? Choose a resolution path below.
        </p>

        <div className="w-full space-y-3 mb-8">
          {supportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[#E6F4EA]/50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E6F4EA] transition-colors">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{option.title}</h3>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => onSelectOption("talk_to_human")}
          className="w-full bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors mb-4"
        >
          Talk to Human Agent
        </button>
        
        <button 
          onClick={onClose}
          className="w-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2 uppercase tracking-wide"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
