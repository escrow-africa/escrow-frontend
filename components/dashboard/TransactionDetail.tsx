import React from "react";
import { Check, Download, Share2, Info, ArrowLeft } from "lucide-react";
import { TransactionItem } from "./TransactionHistory";

interface TransactionDetailProps {
  transaction: TransactionItem;
  onBack: () => void;
}

export default function TransactionDetail({ transaction, onBack }: TransactionDetailProps) {
  const isCompleted = transaction.status === "COMPLETED";

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animation-fade-in relative">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit absolute -top-12 left-0"
      >
        <ArrowLeft size={16} /> Back to Wallet
      </button>

      {/* Main Detail Card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden text-black">
        {/* Top Header Section */}
        <div className="bg-[#0F3D2E] text-white p-12 flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 mb-4">
            Transaction Detail
          </p>
          <h2 className="text-5xl font-bold tracking-tight mb-4 text-white">
            ₦{transaction.amount}
          </h2>
          <div 
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
              isCompleted 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-white/10 border-white/20 text-white"
            }`}
          >
            {isCompleted && <Check size={14} />}
            {transaction.status}
          </div>
        </div>

        {/* Details Grid Section */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 mb-12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Description</p>
              <p className="text-lg font-semibold text-gray-900">{transaction.title}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Transaction ID</p>
              <p className="text-lg font-semibold text-gray-900">{transaction.id}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Date & Time</p>
              <p className="text-lg font-semibold text-gray-900">{transaction.date}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Payment Method</p>
              <p className="text-lg font-semibold text-gray-900">{transaction.paymentMethod || "Escrow Wallet"}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 mb-10"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 border border-gray-200 text-gray-900 font-bold py-3.5 rounded-xl transition-colors hover:bg-gray-50 flex items-center justify-center gap-2">
              <Download size={18} />
              Download Receipt
            </button>
            <button className="flex-1 border border-gray-200 text-gray-900 font-bold py-3.5 rounded-xl transition-colors hover:bg-gray-50 flex items-center justify-center gap-2">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Support Box */}
      <div className="bg-[#F5F9FF] border border-blue-100 rounded-2xl p-6 flex items-start gap-4 text-black">
        <div className="text-blue-500 mt-0.5">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Need help with this transaction?</h4>
          <p className="text-sm text-blue-700/80 mb-3">
            If you have any issues or questions regarding this transaction, please contact our support team.
          </p>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
            Open Support Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
