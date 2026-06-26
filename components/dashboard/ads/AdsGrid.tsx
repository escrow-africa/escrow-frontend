"use client";

import { Ad } from "@/types/ads";
import AdCard from "@/components/dashboard/ads/AdCard";

interface AdsGridProps {
  ads: Ad[];
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onViewInsights: (id: string) => void;
  onFund: (id: string) => void;
  viewMode?: "grid" | "list";
}

export default function AdsGrid({ 
  ads, 
  onToggleStatus, 
  onEdit, 
  onViewInsights,
  onFund,
  viewMode = "grid"
}: AdsGridProps) {
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-4">
        {ads.map((ad) => (
          <div key={ad.id} className="w-full xl:max-w-none">
            <AdCard
              ad={ad}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onViewInsights={onViewInsights}
              onFund={onFund}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {ads.map((ad) => (
        <AdCard
          key={ad.id}
          ad={ad}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onViewInsights={onViewInsights}
          onFund={onFund}
        />
      ))}
    </div>
  );
}

