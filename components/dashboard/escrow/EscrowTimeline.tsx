import React from "react";
import { CheckCircle2 } from "lucide-react";

export interface TimelineStep {
  title: string;
  date: string;
  status: "completed" | "current" | "upcoming";
}

interface EscrowTimelineProps {
  steps: TimelineStep[];
}

export default function EscrowTimeline({ steps }: EscrowTimelineProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
        Transaction Timeline
      </p>
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[11px] top-3 bottom-8 w-[2px] bg-gray-100" />
        
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <div key={index} className="flex gap-4 relative z-10">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-lg bg-[#0F3D2E] flex items-center justify-center text-[#4ADE80]">
                      <CheckCircle2 size={14} className="stroke-[3px]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center" />
                  )}
                </div>
                <div>
                  <h5 className={`text-sm font-bold ${isCompleted ? "text-gray-900" : isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                    {step.title}
                  </h5>
                  <p className="text-xs text-gray-500 font-medium">{step.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
