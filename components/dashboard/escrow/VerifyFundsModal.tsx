import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

interface VerifyFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  escrowId?: string;
  transactionHash?: string;
}

export default function VerifyFundsModal({ 
  isOpen, 
  onClose,
  onSuccess,
  escrowId = "ESC-101",
  transactionHash = "0xed85 ... a219"
}: VerifyFundsModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate network request
    setTimeout(() => {
      setIsVerifying(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => !isVerifying && onClose()}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] p-8 overflow-hidden zoom-in flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6">
          <ShieldCheck size={28} className="text-[#00A859]" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Funds</h2>
        
        <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
          We will perform a real-time check on the secure escrow settlement status.
        </p>

        <div className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 text-left mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Escrow ID</span>
            <span className="text-sm text-gray-900 font-bold">{escrowId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Transaction Hash</span>
            <span className="text-sm text-gray-900 font-mono font-medium">{transactionHash}</span>
          </div>
          
          <div className="pt-4 mt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00A859]"></div>
              <span className="text-xs font-bold text-[#00A859] tracking-wider uppercase">Vault Status: Secured</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-[#0F3D2E] hover:bg-[#185541] disabled:bg-[#0F3D2E] disabled:opacity-90 text-white font-semibold py-3.5 rounded-xl transition-colors mb-4 flex justify-center items-center"
        >
          {isVerifying ? "Verifying Records..." : "Run Full Verification"}
        </button>
        
        <button 
          onClick={onClose}
          disabled={isVerifying}
          className="w-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2 disabled:opacity-50"
        >
          Back to Support
        </button>
      </div>
    </div>
  );
}
