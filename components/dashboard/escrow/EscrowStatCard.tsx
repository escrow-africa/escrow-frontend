import React, { ReactNode } from "react";

export interface EscrowStatCardProps {
  title: string;
  value: string | ReactNode;
  icon: ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
}

export default function EscrowStatCard({
  title,
  value,
  icon,
  iconBgClass = "bg-[#E6F4EA]", // Default light green
  iconColorClass = "text-[#0F3D2E]", // Default dark green
}: EscrowStatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex items-center justify-between">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{title}</h3>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div className={`p-3 rounded-xl ${iconBgClass} ${iconColorClass}`}>
        {icon}
      </div>
    </div>
  );
}
