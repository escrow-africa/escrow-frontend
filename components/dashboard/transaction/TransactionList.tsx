import React from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "lucide-react";

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: "in" | "out";
  status: "COMPLETED" | "PENDING";
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
        <Link href="/dashboard/transactions" className="text-sm font-semibold text-[#0F3D2E] flex items-center gap-1 hover:underline">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {transactions.map((tx, index) => {
          const isDeposit = tx.type === "in";
          const isCompleted = tx.status === "COMPLETED";

          return (
            <div 
              key={tx.id} 
              className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${
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
                  <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                </div>
              </div>

              {/* Right Side: Amount & Status */}
              <div className="text-right">
                <p className={`font-bold ${isDeposit ? "text-[#0F3D2E]" : "text-gray-900"}`}>
                  {isDeposit ? "+" : "-"}{tx.amount}
                </p>
                <div 
                  className={`inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isCompleted 
                      ? "bg-[#E6F4EA] text-[#1E7E34]" 
                      : "bg-[#FFF4E5] text-[#FF8A00]"
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
