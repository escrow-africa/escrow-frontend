import React from "react";
import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";

export interface DisputeCardProps {
  id: string;
  issueId: string;
  orderRef: string;
  date: string;
  title: string;
  description: string;
  amount: string;
  status: "INVESTIGATION_ACTIVE" | "ACTIVE_CASE_DETAILS";
}

export default function DisputeCard({
  id,
  issueId,
  orderRef,
  date,
  title,
  description,
  amount,
  status,
}: DisputeCardProps) {
  return (
    <Link
      href={`/dashboard/disputes/${id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex hover:shadow-md transition-shadow group overflow-hidden"
    >
      <div className="p-5 flex items-center justify-between gap-4 flex-1">
        {/* Left Side Details */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#FFF0F0] border border-[#FFE3E3] flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-[#E53E3E] fill-white" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-[#FFF0F0] text-[#E53E3E] text-[10px] font-bold rounded uppercase tracking-wider">
                {issueId}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Order Ref: <span className="font-semibold text-gray-700">{orderRef}</span>
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">{date}</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500 truncate max-w-xl">
              {description}
            </p>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 bg-[#FFFBEB] border border-[#FEF3C7] text-[#D97706] rounded-md text-[10px] font-bold uppercase tracking-wider">
              {status === "INVESTIGATION_ACTIVE" ? "INVESTIGATION ACTIVE" : "ACTIVE CASE DETAIL"}
            </span>
            <span className="text-lg font-bold text-[#E53E3E]">{amount}</span>
          </div>
          <ChevronRight
            size={18}
            className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}
