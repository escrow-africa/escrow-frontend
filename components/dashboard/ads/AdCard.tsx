"use client";

import Image from "next/image";
import { Eye, MousePointerClick, BarChart3, Pause, Play, Edit3 } from "lucide-react";
import { Ad } from "@/types/ads";

interface AdCardProps {
  ad: Ad;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onViewInsights: (id: string) => void;
}

export default function AdCard({ ad, onToggleStatus, onEdit, onViewInsights }: AdCardProps) {
  return (
    <article className="group bg-white border border-border mb-6 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden h-50">
        <Image
          src={ad.image}
          alt={ad.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <span className={`absolute top-4 right-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${ad.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-slate-800 text-white"}`}>
          {ad.status}
        </span>
      </div>

      <div className="p-4 flex flex-col">
        <div>
          <h2 className="text-2xl font-semibold text-black">{ad.title}</h2>
          <p className="text-sm text-muted-foreground  font-semibold leading-6">{ad.description}</p>
        </div>

        <div className="flex flex-col border-b border-[#E4E3E3] sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            
            <p className="text-xl font-bold text-[#0F3D2E]">₦{ad.price.toLocaleString()}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Eye size={16} /> {ad.views}
            </span>
            <span className="flex items-center gap-2">
              <MousePointerClick size={16} /> {ad.clicks}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
          <button
            type="button"
            onClick={() => onViewInsights(ad.id)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-2 text-sm text-muted-foreground hover:bg-surface-hover transition-colors h-11"
            aria-label={`View insights for ${ad.title}`}
          >
            <BarChart3 size={18} />
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(ad.id)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-2 text-sm text-muted-foreground hover:bg-surface-hover transition-colors h-11"
          >
            {ad.status === "ACTIVE" ? <Pause size={16} /> : <Play size={16} />}
            {ad.status === "ACTIVE" ? "Pause" : "Resume"}
          </button>

          <button
            type="button"
            onClick={() => onEdit(ad.id)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-2 text-sm text-muted-foreground hover:bg-surface-hover transition-colors h-11"
            aria-label={`Edit ${ad.title}`}
          >
            <Edit3 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
