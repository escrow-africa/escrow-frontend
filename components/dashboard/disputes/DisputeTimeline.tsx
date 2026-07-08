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
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
        Mediation Timeline Progress
      </p>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="flex gap-2 items-center">
          {stages.map((stage, index) => {
            const isCompleted = stage.status === "completed";
            const isCurrent = stage.status === "current";

            return (
              <React.Fragment key={index}>
                {/* Stage Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                    isCompleted || isCurrent
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      isCompleted ? "bg-red-500" : "bg-gray-100"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Stage Labels */}
        <div className="flex gap-2">
          {stages.map((stage, index) => (
            <div key={index} className="flex-1">
              <p
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  stage.status === "completed" || stage.status === "current"
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {stage.title}
              </p>
            </div>
          ))}
        </div>

        {/* Current Stage Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium">
            STAGE {currentStage} OF {totalStages}
          </p>
        </div>
      </div>
    </div>
  );
}
