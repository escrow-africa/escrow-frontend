"use client";

import Image from "next/image";
import { Ad } from "@/types/ads";

interface PlatformAdCardProps {
  ad: Ad;
}

export default function PlatformAdCard({ ad }: PlatformAdCardProps) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-[#0F3D2E]/20 rounded-3xl p-5 shadow-[0_10px_30px_rgba(15,61,46,0.04)]">
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-100 mb-5">
        {ad.image ? (
          <Image
            src={ad.image}
            alt={ad.title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#5D6D69]">
            No image selected
          </div>
        )}

        {/* Badges on image */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center">
          {/* Left badge */}
          <span className="rounded-full bg-black/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {ad.badgeLabel || "FEATURED"}
          </span>

          {/* Small orange circle preset badge in the center top */}
          <span className="w-6 h-6 rounded-full bg-[#F3B659] border border-white flex items-center justify-center shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F3D2E]" />
          </span>

          {/* Right badge */}
          <span className="rounded-full bg-[#10B981] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-4">
        {/* Category & Placement Line */}
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#667171]">
          <span>{ad.placementSlot?.split(" (")[0] || "Search Campaign"}</span>
          <span className="text-[#0F3D2E]">CATEGORY: {ad.category?.toUpperCase()}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-black leading-tight">
          {ad.title || "Untitled Ad Campaign"}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#667171] leading-relaxed line-clamp-2 h-10">
          {ad.description || "No description provided."}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4" />

        {/* Price and Button Row */}
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
              BASE PRICE OFFER
            </span>
            <div className="text-xl font-extrabold text-[#0F3D2E]">
              ₦{(ad.price || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl bg-[#0F3D2E] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#185541] transition-all hover:scale-[1.01]"
          >
            Buy Service
          </button>
        </div>
      </div>
    </div>
  );
}
