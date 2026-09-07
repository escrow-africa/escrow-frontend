import React from "react";

export interface TimelineStageItem {
  title: string;
  status: "completed" | "current" | "upcoming";
}

interface DisputeTimelineProps {
  stages: TimelineStageItem[];
  currentStage: number;
  totalStages: number;
}

export default function DisputeTimeline({
  stages,
  currentStage,
  totalStages,
}: DisputeTimelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Timeline Header Row */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Mediation Timeline Progress
        </p>
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
          STAGE {currentStage} OF {totalStages}
        </p>
      </div>

      <div className="space-y-3">
        {/* Progress Bars Row */}
        <div className="flex gap-2">
          {stages.map((stage, index) => {
            const isActive = stage.status === "completed" || stage.status === "current";
            return (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  isActive ? "bg-[#C53030]" : "bg-gray-100"
                }`}
              />
            );
          })}
        </div>

        {/* Stage Labels Row */}
        <div className="flex gap-2">
          {stages.map((stage, index) => {
            const isActive = stage.status === "completed" || stage.status === "current";
            return (
              <div key={index} className="flex-1 text-center sm:text-left">
                <p
                  className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    isActive ? "text-[#C53030]" : "text-gray-400"
                  }`}
                >
                  {stage.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
