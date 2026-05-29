"use client";

import { Ad } from "@/types/ads";
import AdCard from "@/components/dashboard/ads/AdCard";

interface AdsGridProps {
  ads: Ad[];
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onViewInsights: (id: string) => void;
}

export default function AdsGrid({ ads, onToggleStatus, onEdit, onViewInsights }: AdsGridProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {ads.map((ad) => (
        <AdCard
          key={ad.id}
          ad={ad}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onViewInsights={onViewInsights}
        />
      ))}
    </div>
  );
}
