import React from "react";
import { X, Lock } from "lucide-react";

interface EscrowProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EscrowProtectionModal({ isOpen, onClose }: EscrowProtectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 transition-all duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-[540px] overflow-hidden shadow-2xl flex flex-col p-8 md:p-10 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 md:right-8 md:top-8 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 pr-8">
          Escrow Protection Policy
        </h2>

        {/* List of Features */}
        <div className="space-y-6 mb-8">
          {/* Vaulted Security */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Lock size={18} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">Vaulted Security</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                All funds are kept in a separate, regulated Trust Account until all trade conditions are met.
              </p>
            </div>
          </div>

          {/* Inspection Period */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Lock size={18} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">Inspection Period</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Buyers have a fixed window (standard 3 days) to inspect deliverables before funds are released.
              </p>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Lock size={18} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">Dispute Resolution</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Our agents provide neutral 3rd–party mediation for any unresolvable contract conflicts.
              </p>
            </div>
          </div>

          {/* Fraud Prevention */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Lock size={18} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">Fraud Prevention</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Identity verification requirements for high-ticket transactions protect both parties.
              </p>
            </div>
          </div>
        </div>

        {/* Protocol Disclaimer Box */}
        <div className="bg-[#EFF6FF] rounded-2xl p-4 text-center mb-8 border border-[#DBEAFE]">
          <p className="text-xs text-[#1E40AF] font-medium leading-relaxed">
            By using EscrowAfrica NG, you agree to our full{" "}
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              className="text-[#1D4ED8] font-bold underline hover:text-[#1E40AF] transition-colors"
            >
              Secure Protocol Documentation
            </a>
          </p>
        </div>

        {/* Accept Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold rounded-2xl text-sm transition-colors shadow-sm cursor-pointer"
        >
          Accept & Return
        </button>

      </div>
    </div>
  );
}
