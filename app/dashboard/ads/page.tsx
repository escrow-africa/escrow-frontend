"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdsGrid from "@/components/dashboard/ads/AdsGrid";
import { fetchAds } from "@/api/ads";
import { Ad } from "@/types/ads";

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAds()
      .then((data) => setAds(data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleStatus = (id: string) => {
    setAds((currentAds) =>
      currentAds.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
            }
          : item,
      ),
    );
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/ads/${id}/edit`);
  };

  const handleViewInsights = (id: string) => {
    router.push(`/dashboard/ads/${id}`);
  };

  return (
    <div className="flex flex-col h-full fade-in pb-12">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          
          <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Seller Ads</h1>
          <p className="text-muted-foreground text-sm">
            Manage and track your product promotions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/ads/create")}
          className="inline-flex items-center justify-center rounded-2xl bg-[#0F3D2E] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#123f30] transition-colors"
        >
          + Create Ad
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-border bg-white p-8 text-center text-sm text-muted-foreground shadow-sm">
          Loading ads...
        </div>
      ) : (
        <AdsGrid
          ads={ads}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
          onViewInsights={handleViewInsights}
        />
      )}
    </div>
  );
}
