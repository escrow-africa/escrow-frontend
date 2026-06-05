import Link from "next/link";
import React from "react";
import { ArrowUpRight, Plus } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-foreground mb-2">Quick Actions</h2>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link
          href="/dashboard/wallet?action=withdraw"
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-surface border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-muted-foreground transition-all shadow-sm"
        >
          <ArrowUpRight size={16} />
          Withdraw Money
        </Link>
        <Link
          href="/dashboard/ads"
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-surface border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-muted-foreground transition-all shadow-sm"
        >
          <Plus size={16} />
          Create Ad
        </Link>
      </div>
    </div>
  );
}
