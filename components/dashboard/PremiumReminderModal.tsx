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
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl relative"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Boost Sales Section */}
          <div className="bg-[#0F3D2E] p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10">
              <Megaphone size={160} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                Boost Your Sales
              </h2>
              <p className="text-sm text-[#8BAA9E] mb-8 leading-relaxed">
                Create an ad today and reach thousands of potential buyers instantly. Drive more traffic to your escrows.
              </p>
            </div>
            
            <button className="w-full py-3.5 bg-[#F3B659] hover:bg-[#e0a241] text-[#0F3D2E] font-bold rounded-xl transition-colors shadow-lg shadow-[#F3B659]/20">
              Get Started
            </button>
          </div>

          {/* Pro Features Section */}
          <div className="bg-[#0A0D14] p-10 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-white">
                <Crown className="text-[#F3B659]" size={24} />
                Pro Features
              </h2>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                Upgrade to Pro for unlimited ads, lower fees, and real-time analytics to scale your business.
              </p>
            </div>
            
            <button className="w-full py-3.5 bg-white hover:bg-gray-100 text-[#0A0D14] font-bold rounded-xl transition-colors shadow-lg shadow-white/10">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
