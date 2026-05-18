import React from "react";
import { ArrowUpRight, Plus } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          <ArrowUpRight size={18} />
          Withdraw Money
        </button>
        <button className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          <Plus size={18} />
          Create Ad
        </button>
      </div>
    </div>
  );
}
