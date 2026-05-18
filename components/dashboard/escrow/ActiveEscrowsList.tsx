import React from "react";
import Link from "next/link";

export interface ActiveEscrow {
  id: string;
  title: string;
  partnerName: string;
  amount: string;
  dotColorClass: string;
}

interface ActiveEscrowsListProps {
  escrows: ActiveEscrow[];
}

export default function ActiveEscrowsList({ escrows }: ActiveEscrowsListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Active Escrows</h2>
      
      <div className="space-y-6 flex-1">
        {escrows.map((escrow) => (
          <div key={escrow.id} className="flex justify-between items-center group cursor-pointer gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Colored Dot Indicator */}
              <div className={`shrink-0 w-2 h-2 rounded-full ${escrow.dotColorClass}`} />
              
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0F3D2E] transition-colors truncate">{escrow.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{escrow.partnerName}</p>
              </div>
            </div>
            <div className="shrink-0 font-bold text-sm text-gray-900">
              {escrow.amount}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center border-t border-gray-50 pt-4">
        <Link href="/dashboard/escrows" className="text-sm font-semibold text-[#0F3D2E] hover:underline">
          View All
        </Link>
      </div>
    </div>
  );
}
