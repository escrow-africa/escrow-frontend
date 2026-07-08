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
      className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col hover:shadow-md transition-shadow group"
    >
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={16} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {issueId}
              </p>
              <p className="text-xs text-gray-500">
                Order Ref: {orderRef} • {date}
              </p>
            </div>
          </div>
          <ChevronRight
            size={20}
            className="text-gray-400 group-hover:text-gray-600 transition-colors"
          />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-xs font-bold uppercase tracking-wider">
            {status === "INVESTIGATION_ACTIVE" ? "INVESTIGATION ACTIVE" : "ACTIVE CASE DETAILS"}
          </span>
          <span className="text-lg font-bold text-red-500">{amount}</span>
        </div>
      </div>
    </Link>
  );
}
