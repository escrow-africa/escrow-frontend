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
    <div className="bg-surface rounded-2xl border border-[#E4E3E3CC] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#E4E3E3CC]">
        <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
        <Link href="/dashboard/transactions" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
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
              className={`flex items-center justify-between p-3 md:p-4 hover:bg-surface-hover transition-colors gap-3 ${
                index !== transactions.length - 1 ? "border-b border-[#E4E3E3CC]" : ""
              }`}
            >
              {/* Left Side: Icon & Details */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div 
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isDeposit ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate text-sm md:text-base">{tx.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tx.date}</p>
                </div>
              </div>

              {/* Right Side: Amount & Status */}
              <div className="text-right shrink-0">
                <p className={`font-bold text-sm md:text-base ${isDeposit ? "text-primary" : "text-foreground"}`}>
                  {isDeposit ? "+" : "-"}{tx.amount}
                </p>
                <div 
                  className={`inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isCompleted 
                      ? "bg-green-500/10 text-green-600" 
                      : "bg-orange-500/10 text-orange-500"
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
