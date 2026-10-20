import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function Pagination({ page, limit, total, onPageChange, itemLabel = "items" }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  if (totalPages <= 1) return null;

  // Cap the number of page buttons shown so this stays usable with large result sets.
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex justify-between items-center py-4">
      <p className="text-xs text-gray-500 font-medium">
        Showing Page {page} of {totalPages} ({total} {itemLabel} total)
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium text-gray-600 flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </button>

        <div className="flex gap-1">
          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                p === page ? "bg-[#0F3D2E] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium text-gray-600 flex items-center gap-1"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
