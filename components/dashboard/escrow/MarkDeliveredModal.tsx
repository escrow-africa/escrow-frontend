import React, { useState, useEffect } from "react";
import { Truck, CheckCircle2 } from "lucide-react";

type ModalState = "confirm" | "syncing" | "success";

interface MarkDeliveredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarkDeliveredModal({ isOpen, onClose }: MarkDeliveredModalProps) {
  const [modalState, setModalState] = useState<ModalState>("confirm");

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setModalState("confirm");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setModalState("syncing");
    
    // Simulate network request
    setTimeout(() => {
      setModalState("success");
    }, 2500);
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
            
            <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
              Once you mark as delivered, the buyer's 3-day review period begins. Ensure all assets are ready.
            </p>
            
            <button 
              onClick={handleConfirm}
              className="w-full bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors mb-4"
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
