import React from "react";
import { Crown, Megaphone, X } from "lucide-react";

interface PremiumReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumReminderModal({ isOpen, onClose }: PremiumReminderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl relative"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X size={18} />
        </button>

        <div className="p-10 bg-[#0F3D2E] text-white rounded-3xl">
          <div className="relative overflow-hidden mb-8">
            <div className="absolute -top-10 -right-10 opacity-10">
              <Megaphone size={160} />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                Boost Your Sales
              </h2>
              <p className="text-sm text-[#8BAA9E] leading-relaxed">
                Create an ad today and reach thousands of potential buyers instantly. Drive more traffic to your escrows.
              </p>
            </div>
          </div>

          <button className="w-full py-3.5 bg-[#F3B659] hover:bg-[#e0a241] text-[#0F3D2E] font-bold rounded-xl transition-colors shadow-lg shadow-[#F3B659]/20">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
