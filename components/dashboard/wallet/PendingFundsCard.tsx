import React from "react";
import { Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface PendingFundsCardProps {
  amount: string;
  statusText: string;
  type: "processing" | "active";
  onActionClick: () => void;
}

export default function PendingFundsCard({
  amount,
  statusText,
  type,
  onActionClick,
}: PendingFundsCardProps) {
  const isProcessing = type === "processing";

  return (
    <div className="bg-white border text-black border-[#E4E3E3CC] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-4 flex flex-col h-full justify-between flex-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[9px] text-gray-500 font-medium ">Pending Funds</p>
          <h3 className="text-lg font-bold text-gray-900">₦{amount}</h3>
        </div>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isProcessing ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"
          }`}
        >
          {isProcessing ? <Clock size={18} /> : <ShieldCheck size={18} />}
        </div>
      </div>

      <div className="flex border-t border-gray-50 pt-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isProcessing ? "bg-orange-500" : "bg-blue-500"
            }`}
          ></span>
          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
            {statusText}
          </span>
        </div>
        <button
          onClick={onActionClick}
          className="text-[9px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider flex items-center gap-1"
        >
          {isProcessing ? "Details" : "Manage"} <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
