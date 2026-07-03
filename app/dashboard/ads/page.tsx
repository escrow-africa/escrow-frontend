"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Eye, MousePointerClick, Wallet, Search, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import AdsGrid from "@/components/dashboard/ads/AdsGrid";
import { fetchAds, updateAd } from "@/api/ads";
import { Ad } from "@/types/ads";

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [revenue, setRevenue] = useState(500295.05);
  const router = useRouter();

  useEffect(() => {
    fetchAds()
      .then((data) => setAds(data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleStatus = async (id: string) => {
    const adToToggle = ads.find((a) => a.id === id);
    if (!adToToggle) return;

    const newStatus = adToToggle.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const updated = await updateAd(id, { status: newStatus });
    
    if (updated) {
      setAds((current) => current.map((a) => (a.id === id ? updated : a)));
      toast.success(newStatus === "ACTIVE" ? "Campaign started!" : "Campaign paused!");
    } else {
      toast.error("Failed to update status.");
    }
  };

  const handleFundCampaign = async (id: string) => {
    const adToFund = ads.find((a) => a.id === id);
    if (!adToFund) return;

    // Simulate funding
    const fundAmount = adToFund.totalBudget - adToFund.spentBudget;
    const updated = await updateAd(id, {
      spentBudget: adToFund.totalBudget,
      status: "ACTIVE"
    });

    if (updated) {
      setAds((current) => current.map((a) => (a.id === id ? updated : a)));
      setRevenue((prev) => prev + fundAmount * 0.05); // simulate small referral/ad revenue commission
      toast.success(`Successfully funded Campaign ${id}!`);
    } else {
      toast.error("Failed to fund campaign.");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/ads/${id}/edit`);
  };

  const handleViewInsights = (id: string) => {
    router.push(`/dashboard/ads/${id}`);
  };

  const handleCardClick = (id: string) => {
    router.push(`/dashboard/ads/${id}`);
  };

  // Filtered ads
  const filteredAds = useMemo(() => {
    return ads.filter(
      (ad) =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ads, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const activePromotions = ads.filter((a) => a.status === "ACTIVE").length;
    const platformImpressions = ads.reduce((acc, curr) => acc + curr.views, 0);
    const conversionClicks = ads.reduce((acc, curr) => acc + curr.clicks, 0);
    return {
      activePromotions,
      platformImpressions,
      conversionClicks,
    };
  }, [ads]);

  return (
    <div className="flex flex-col h-full fade-in pb-12 px-1">
      {/* Top Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Advertisement Lab</h1>
          <p className="text-[#667171] text-sm">
            Promote your custom packages, services, or portfolios across placements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/ads/create")}
          className="inline-flex items-center justify-center rounded-2xl bg-[#0F3D2E] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#185541] transition-all hover:scale-[1.01]"
        >
          + Create Ad Campaign
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Active Promotions */}
        <div className="bg-white border border-[#E4E3E3] rounded-3xl p-5 shadow-sm flex items-start justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">Active Promotions</span>
            <div className="text-2xl font-bold text-black">{stats.activePromotions}</div>
            <span className="text-xs text-[#667171]">in circulation</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E5F7F0] flex items-center justify-center text-[#0F3D2E]">
            <Megaphone size={18} />
          </div>
        </div>

        {/* Platform Impressions */}
        <div className="bg-white border border-[#E4E3E3] rounded-3xl p-5 shadow-sm flex items-start justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">Platform Impressions</span>
            <div className="text-2xl font-bold text-black">{stats.platformImpressions.toLocaleString()}</div>
            <span className="text-xs text-[#667171]">Targeted views</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
            <Eye size={18} />
          </div>
        </div>

        {/* Conversion Clicks */}
        <div className="bg-white border border-[#E4E3E3] rounded-3xl p-5 shadow-sm flex items-start justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">Conversion Clicks</span>
            <div className="text-2xl font-bold text-black">{stats.conversionClicks.toLocaleString()}</div>
            <span className="text-xs text-[#667171]">High interest</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FDF2F8] flex items-center justify-center text-[#DB2777]">
            <MousePointerClick size={18} />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-[#E4E3E3] rounded-3xl p-5 shadow-sm flex items-start justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">Total Revenue</span>
            <div className="text-2xl font-bold text-black">
              ₦{revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-[#667171]">From ad leads</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
            <Wallet size={18} />
          </div>
        </div>
      </div>

      {/* Filter and View Toggles Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#667171]">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search ID or buyer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] text-sm outline-none transition focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]/20"
          />
        </div>

        {/* Layout Toggle */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#F3F4F6] p-1.5 rounded-2xl border border-[#E4E3E3]">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-[#667171] hover:text-black"
            }`}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "list" ? "bg-white text-black shadow-sm" : "text-[#667171] hover:text-black"
            }`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Main Campaign Grid/List */}
      {isLoading ? (
        <div className="rounded-3xl border border-[#E4E3E3] bg-white p-12 text-center text-sm text-[#667171] shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <span className="w-6 h-6 border-2 border-t-transparent border-[#0F3D2E] rounded-full animate-spin" />
            <span>Loading advertisements...</span>
          </div>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="rounded-3xl border border-[#E4E3E3] bg-white p-12 text-center text-sm text-[#667171] shadow-sm">
          No advertisements found matching &quot;{searchQuery}&quot;.
        </div>
      ) : (
        <AdsGrid
          ads={filteredAds}
          onCardClick={handleCardClick}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
          onViewInsights={handleViewInsights}
          onFund={handleFundCampaign}
          viewMode={viewMode}
        />
      )}

      {/* Pagination Footer */}
      {!isLoading && filteredAds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-[#E4E3E3]">
          <span className="text-xs text-[#667171]">
            Showing Page 1 of 1 ({filteredAds.length} items total)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-[#667171] bg-gray-50 cursor-not-allowed transition"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#0F3D2E] text-white shadow-sm transition">
              1
            </button>
            <button className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#E4E3E3] text-[#667171] hover:bg-gray-50 transition">
              2
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[#E4E3E3] text-[#667171] hover:bg-gray-50 transition">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

