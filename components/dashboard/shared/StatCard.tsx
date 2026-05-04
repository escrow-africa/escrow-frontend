import React, { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string | ReactNode;
  icon: ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
  topRightContent?: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBgClass = "bg-green-100",
  iconColorClass = "text-green-600",
  topRightContent,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2 rounded-lg ${iconBgClass} ${iconColorClass}`}>
          {icon}
        </div>
        {topRightContent && (
          <div className="text-sm font-medium">
            {topRightContent}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm text-gray-500 font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
