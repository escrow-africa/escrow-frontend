import React from "react";
import { ArrowDownLeft, ArrowUpRight, Download, ChevronDown } from "lucide-react";

export interface TransactionItem {
  id: string;
  title: string;
  date: string; // E.g. "3/20/2026, 6:30:00 AM" for detail, or just short string
  amount: string; // e.g. "700,000"
  type: "in" | "out";
  status: "COMPLETED" | "PENDING";
  paymentMethod?: string;
}

interface TransactionHistoryProps {
  transactions: TransactionItem[];
  onSelectTransaction: (transaction: TransactionItem) => void;
}

export default function TransactionHistory({ transactions, onSelectTransaction }: TransactionHistoryProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden text-black mb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            All <ChevronDown size={16} className="text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Download size={16} className="text-gray-400" /> Export
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {transactions.map((tx, index) => {
          const isDeposit = tx.type === "in";
          const isCompleted = tx.status === "COMPLETED";

          // Parse date for list display just showing the date part if it contains time
          const dateOnly = tx.date.split(',')[0];

          return (
            <div 
              key={tx.id} 
              onClick={() => onSelectTransaction(tx)}
              className={`flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                index !== transactions.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              {/* Left Side: Icon & Details */}
              <div className="flex items-center gap-4">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDeposit ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                  }`}
                >
                  {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{tx.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{dateOnly}</p>
                </div>
              </div>

              {/* Right Side: Amount & Status */}
              <div className="text-right">
                <p className={`font-bold ${isDeposit ? "text-emerald-500" : "text-gray-900"}`}>
                  {isDeposit ? "+" : "-"}{tx.amount}
                </p>
                <div 
                  className={`inline-flex mt-1 items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isCompleted 
                      ? "bg-green-50 text-emerald-500" 
                      : "bg-orange-50 text-orange-500"
                  }`}
                >
                  {tx.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
