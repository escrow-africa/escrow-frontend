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
    <div className="bg-white border text-black border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Pending Funds</p>
          <h3 className="text-2xl font-bold text-gray-900">₦{amount}</h3>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isProcessing ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"
          }`}
        >
          {isProcessing ? <Clock size={20} /> : <ShieldCheck size={20} />}
        </div>
      </div>

      <div className="flex border-t border-gray-50 pt-4 items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isProcessing ? "bg-orange-500" : "bg-blue-500"
            }`}
          ></span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            {statusText}
          </span>
        </div>
        <button
          onClick={onActionClick}
          className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider flex items-center gap-1"
        >
          {isProcessing ? "Details" : "Manage"} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
