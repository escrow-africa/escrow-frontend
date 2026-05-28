import Link from "next/link";
import React from "react";
import { ArrowUpRight, Plus } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href="/dashboard/wallet?action=withdraw"
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-surface-hover hover:border-muted-foreground transition-all shadow-sm"
        >
          <ArrowUpRight size={18} />
          Withdraw Money
        </Link>
        <button className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-surface-hover hover:border-muted-foreground transition-all shadow-sm">
          <Plus size={18} />
          Create Ad
        </button>
      </div>
    </div>
  );
}
