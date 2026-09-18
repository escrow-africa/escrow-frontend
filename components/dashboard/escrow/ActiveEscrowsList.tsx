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
    <div className="bg-surface rounded-2xl border border-border p-4 md:p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
      <h2 className="text-lg font-bold text-foreground mb-6">Active Escrows</h2>
      
      <div className="space-y-6 flex-1">
        {escrows.length > 0 ? escrows.map((escrow) => (
          <div key={escrow.id} className="flex justify-between items-center group cursor-pointer gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Colored Dot Indicator */}
              <div className={`shrink-0 w-2 h-2 rounded-full ${escrow.dotColorClass}`} />
              
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">{escrow.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{escrow.partnerName}</p>
              </div>
            </div>
            <div className="shrink-0 font-bold text-sm text-foreground">
              {escrow.amount}
            </div>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground text-center py-8">No active escrows at the moment.</p>
        )}
      </div>

      <div className="mt-8 text-center border-t border-muted pt-4">
        <Link href="/dashboard/escrows" className="text-sm font-semibold text-primary hover:underline">
          View All
        </Link>
      </div>
    </div>
  );
}
