"use client";

import Image from "next/image";
import { Eye, MousePointerClick, BarChart3, Pause, Play, Edit3, Heart, Wallet } from "lucide-react";
import { Ad } from "@/types/ads";

interface AdCardProps {
  ad: Ad;
  onCardClick?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewInsights?: (id: string) => void;
  onFund?: (id: string) => void;
  previewMode?: boolean;
}

export default function AdCard({
  ad,
  onCardClick,
  onToggleStatus,
  onEdit,
  onViewInsights,
  onFund,
  previewMode = false
}: AdCardProps) {
  // Theme badge styling
  const getThemeBadgeStyles = (theme: string) => {
    switch (theme) {
      case "Neon Theme":
        return "text-[#0F3D2E] font-mono text-xs font-bold";
      case "Luxury Theme":
        return "text-[#B8860B] font-serif text-xs font-bold";
      case "Cyberpunk Theme":
        return "text-[#C026D3] font-mono text-xs font-bold";
      default:
        return "text-[#667171] text-xs font-bold";
    }
  };

  // Badge on the image
  const renderImageBadges = () => {
    const leftBadge = ad.badgeLabel || (ad.status === "OUT OF FUEL" ? "OUT OF FUEL" : null);
    const rightBadge = ad.status;

    return (
      <>
        {/* Left Badge */}
        {leftBadge && (
          <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            leftBadge === "OUT OF FUEL" 
              ? "bg-[#333333] text-white" 
              : "bg-[#8A9A1E] text-white"
          }`}>
            {leftBadge}
          </span>
        )}

        {/* Right Badge */}
        <span className={`absolute top-4 right-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
          rightBadge === "ACTIVE" 
            ? "bg-[#10B981] text-white" 
            : rightBadge === "PAUSED"
            ? "bg-[#F59E0B] text-white"
            : "bg-[#EF4444] text-white"
        }`}>
          {rightBadge === "OUT OF FUEL" ? "PAUSED" : rightBadge === "OUT OF BUDGET" ? "OUT OF BUDGET" : rightBadge}
        </span>
      </>
    );
  };

  // Campaign fuel calculations
  const totalBudget = ad.totalBudget || 120000;
  const spentBudget = ad.spentBudget || 0;
  const fuelPercentage = Math.min(100, Math.max(0, (spentBudget / totalBudget) * 100));
  const isOutOfFuel = ad.status === "OUT OF FUEL" || ad.status === "OUT OF BUDGET" || spentBudget <= 0;
  const cardClasses = `bg-white border border-[#E4E3E3] rounded-3xl p-4 flex flex-col shadow-sm transition-all duration-300 ${
    onCardClick ? "cursor-pointer hover:shadow-lg" : "hover:shadow-md"
  }`;

  return (
    <article
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={() => onCardClick?.(ad.id)}
      onKeyDown={(e) => {
        if (!onCardClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick(ad.id);
        }
      }}
      className={cardClasses}
    >
      {/* Image Header */}
      <div className="relative overflow-hidden h-48 rounded-2xl mb-4 w-full bg-[#E7ECEA]">
        {ad.image ? (
          <Image
            src={ad.image}
            alt={ad.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={ad.id === "AD-001"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#5D6D69]">
            No image selected
          </div>
        )}
        {renderImageBadges()}
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col">
        {/* ID & Theme Row */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-[#667171] font-mono">ID: {ad.id || "PENDING"}</span>
          <span className={getThemeBadgeStyles(ad.theme)}>{ad.theme}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-black mb-1 line-clamp-1">{ad.title || "Untitled Campaign"}</h2>
        
        {/* Description */}
        <p className="text-xs text-[#667171] leading-relaxed mb-4 line-clamp-2 h-8">
          {ad.description || "No description provided."}
        </p>

        {/* Campaign Fuel progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="text-[#667171]">Campaign Fuel</span>
            <span className={isOutOfFuel ? "text-[#EF4444]" : "text-black"}>
              ₦{spentBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })} / ₦{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="w-full bg-[#F3F4F6] rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isOutOfFuel ? "bg-[#EF4444]" : "bg-[#0F3D2E]"
              }`}
              style={{ width: `${fuelPercentage}%` }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E4E3E3] my-2" />

        {/* Price & Metrics */}
        <div className="flex justify-between items-center py-2 mb-3">
          <div className="text-base font-bold text-[#0F3D2E]">
            ₦{ad.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-3 text-xs text-[#667171]">
            <span className="flex items-center gap-1">
              <Eye size={14} className="text-[#667171]" /> {ad.views}
            </span>
            <span className="flex items-center gap-1">
              <MousePointerClick size={14} className="text-[#667171]" /> {ad.clicks}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        {!previewMode && (
          <div className="flex gap-2 items-center mt-auto">
            {/* Insights button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewInsights?.(ad.id);
              }}
              className="flex items-center justify-center rounded-xl border border-[#E4E3E3] bg-white p-2.5 text-[#667171] hover:bg-[#FAFBFA] transition-colors w-11 h-11"
              title="View Insights"
            >
              <BarChart3 size={18} />
            </button>

            {/* Toggle Status / Fund Campaign */}
            {isOutOfFuel ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFund?.(ad.id);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#EF4444] text-white font-bold text-xs h-11 hover:bg-[#DC2626] transition-colors"
              >
                <Wallet size={14} /> Fund Campaign
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus?.(ad.id);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#E4E3E3] bg-white text-[#667171] font-bold text-xs h-11 hover:bg-[#FAFBFA] transition-colors"
              >
                {ad.status === "ACTIVE" ? (
                  <>
                    <Pause size={14} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={14} /> Start
                  </>
                )}
              </button>
            )}

            {/* Edit button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(ad.id);
              }}
              className="flex items-center justify-center rounded-xl border border-[#E4E3E3] bg-white p-2.5 text-[#667171] hover:bg-[#FAFBFA] transition-colors w-11 h-11"
              title="Edit Campaign"
            >
              <Edit3 size={18} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
