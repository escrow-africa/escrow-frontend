"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Eye, MousePointerClick, Play, Pause, Wallet, Edit3, Trash2, 
  ArrowLeft, Calendar, Tag, ShieldCheck, HelpCircle, Layers, Users 
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchAd, updateAd, deleteAd } from "@/api/ads";
import { Ad } from "@/types/ads";

interface AdDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function AdDetailsPage({ params }: AdDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAd(id)
      .then((data) => {
        setAd(data);
      })
      .catch(() => {
        toast.error("Failed to load campaign details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleToggleStatus = async () => {
    if (!ad) return;
    const newStatus = ad.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const updated = await updateAd(ad.id, { status: newStatus });
    if (updated) {
      setAd(updated);
      toast.success(newStatus === "ACTIVE" ? "Campaign started!" : "Campaign paused!");
    } else {
      toast.error("Failed to update campaign status.");
    }
  };

  const handleFundCampaign = async () => {
    if (!ad) return;
    const updated = await updateAd(ad.id, {
      spentBudget: ad.totalBudget,
      status: "ACTIVE"
    });
    if (updated) {
      setAd(updated);
      toast.success("Campaign successfully funded! Budget refueled.");
    } else {
      toast.error("Failed to fund campaign.");
    }
  };

  const handleDelete = async () => {
    if (!ad) return;
    if (confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      setIsDeleting(true);
      const success = await deleteAd(ad.id);
      if (success) {
        toast.success("Campaign deleted successfully.");
        router.push("/dashboard/ads");
      } else {
        toast.error("Failed to delete campaign.");
        setIsDeleting(false);
      }
    }
  };

  // Calculations
  const conversionCount = useMemo(() => {
    if (!ad) return 0;
    return Math.max(0, Math.round(ad.clicks * 0.15));
  }, [ad]);

  const fuelPercentage = useMemo(() => {
    if (!ad) return 0;
    return Math.min(100, Math.max(0, (ad.spentBudget / ad.totalBudget) * 100));
  }, [ad]);

  const isOutOfFuel = useMemo(() => {
    if (!ad) return true;
    return ad.status === "OUT OF FUEL" || ad.status === "OUT OF BUDGET" || ad.spentBudget <= 0;
  }, [ad]);

  // Mock data for weekly chart
  const weeklyData = useMemo(() => {
    if (!ad) return [];
    const baseViews = ad.views / 7;
    const baseClicks = ad.clicks / 7;
    return [
      { day: "Mon", views: Math.round(baseViews * 0.8), clicks: Math.round(baseClicks * 0.6) },
      { day: "Tue", views: Math.round(baseViews * 1.1), clicks: Math.round(baseClicks * 1.2) },
      { day: "Wed", views: Math.round(baseViews * 0.9), clicks: Math.round(baseClicks * 0.8) },
      { day: "Thu", views: Math.round(baseViews * 1.3), clicks: Math.round(baseClicks * 1.5) },
      { day: "Fri", views: Math.round(baseViews * 1.0), clicks: Math.round(baseClicks * 0.9) },
      { day: "Sat", views: Math.round(baseViews * 0.7), clicks: Math.round(baseClicks * 0.5) },
      { day: "Sun", views: Math.round(baseViews * 1.2), clicks: Math.round(baseClicks * 1.1) },
    ];
  }, [ad]);

  const maxChartVal = useMemo(() => {
    if (weeklyData.length === 0) return 100;
    const maxVal = Math.max(...weeklyData.map(d => d.views));
    return maxVal > 0 ? maxVal * 1.2 : 100;
  }, [weeklyData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-[#667171] gap-3">
        <span className="w-8 h-8 border-3 border-t-transparent border-[#0F3D2E] rounded-full animate-spin" />
        <span className="font-semibold text-sm">Loading campaign details...</span>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="flex flex-col h-full fade-in pb-12 px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Campaign not found</h1>
          <p className="text-muted-foreground text-sm">No advertisement campaign matches that ID.</p>
        </div>
        <Link href="/dashboard/ads" className="inline-flex items-center gap-2 justify-center px-5 py-3 rounded-2xl bg-[#0F3D2E] text-white text-sm font-semibold hover:bg-[#123f30] transition-colors self-start">
          <ArrowLeft size={16} /> Back to Ads
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full fade-in pb-12 px-4 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/dashboard/ads")}
            className="inline-flex items-center gap-2 text-xs text-[#667171] hover:text-black font-bold uppercase tracking-wider mb-2 transition"
          >
            <ArrowLeft size={14} /> Back to Campaigns
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F3D2E]">Campaign Insights & Details</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/dashboard/ads/${ad.id}/edit`)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E4E3E3] bg-white px-5 py-3 text-sm font-semibold text-[#0F3D2E] hover:bg-gray-50 transition"
          >
            <Edit3 size={16} /> Edit Campaign
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1.1fr]">
        {/* Main Content Pane */}
        <div className="space-y-6">
          {/* Card Hero Banner */}
          <div className="rounded-3xl border border-[#E4E3E3] bg-white shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="relative h-60 md:h-auto md:w-[240px] bg-gray-100 flex-shrink-0">
              <Image
                src={ad.image}
                alt={ad.title}
                fill
                className="object-cover"
                unoptimized
              />
              <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                ad.status === "ACTIVE" 
                  ? "bg-[#10B981] text-white" 
                  : ad.status === "PAUSED"
                  ? "bg-[#F59E0B] text-white"
                  : "bg-[#EF4444] text-white"
              }`}>
                {ad.status === "OUT OF FUEL" ? "PAUSED" : ad.status === "OUT OF BUDGET" ? "OUT OF BUDGET" : ad.status}
              </span>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-[#667171]">ID: {ad.id}</span>
                  <span className="text-xs font-bold text-[#0F3D2E] bg-[#E5F7F0] px-2.5 py-0.5 rounded-full">
                    {ad.theme}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">{ad.title}</h2>
                <p className="text-sm text-[#667171] leading-relaxed line-clamp-3">{ad.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F3F4F6] flex justify-between items-center">
                <span className="text-xs text-[#667171] font-semibold">Promotion Budget Base Price</span>
                <span className="text-2xl font-bold text-[#0F3D2E]">
                  ₦{ad.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid gap-4 grid-cols-3">
            <div className="rounded-3xl border border-[#E4E3E3] bg-white p-5 text-center shadow-sm">
              <span className="inline-flex p-2 rounded-full bg-[#EEF2FF] text-[#4F46E5] mb-2">
                <Eye size={16} />
              </span>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#667171]">Views</p>
              <p className="mt-1 text-2xl font-bold text-[#0F3D2E]">{ad.views.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-[#E4E3E3] bg-white p-5 text-center shadow-sm">
              <span className="inline-flex p-2 rounded-full bg-[#FDF2F8] text-[#DB2777] mb-2">
                <MousePointerClick size={16} />
              </span>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#667171]">Clicks</p>
              <p className="mt-1 text-2xl font-bold text-[#0F3D2E]">{ad.clicks.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-[#E4E3E3] bg-white p-5 text-center shadow-sm">
              <span className="inline-flex p-2 rounded-full bg-[#ECFDF5] text-[#059669] mb-2">
                <ShieldCheck size={16} />
              </span>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#667171]">Conversions</p>
              <p className="mt-1 text-2xl font-bold text-[#0F3D2E]">{conversionCount.toLocaleString()}</p>
            </div>
          </div>

          {/* Campaign Fuel progress pane */}
          <div className="rounded-3xl border border-[#E4E3E3] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-black mb-4">Campaign Fuel Progress</h3>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#667171]">Spent Fuel Budget</span>
              <span className={isOutOfFuel ? "text-[#EF4444] font-bold" : "text-black font-bold"}>
                ₦{ad.spentBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })} / ₦{ad.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-full bg-[#F3F4F6] rounded-full h-3.5 overflow-hidden mb-3">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isOutOfFuel ? "bg-[#EF4444]" : "bg-[#0F3D2E]"
                }`}
                style={{ width: `${fuelPercentage}%` }}
              />
            </div>
            <p className="text-xs text-[#667171] leading-relaxed">
              Campaign fuel is consumed based on views and clicks in placements. Once the fuel reaches ₦0.00, your advertisement campaign will stop running until funded.
            </p>
          </div>

          {/* CSS Chart: Weekly Performance */}
          <div className="rounded-3xl border border-[#E4E3E3] bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-black">Weekly Performance Insights</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0F3D2E]" /> Views</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" /> Clicks</span>
              </div>
            </div>

            {/* Simulated Bar Chart */}
            <div className="h-48 flex items-end gap-3 md:gap-6 border-b border-gray-200 pb-2">
              {weeklyData.map((d, index) => {
                const viewsHeight = `${(d.views / maxChartVal) * 100}%`;
                const clicksHeight = `${(d.clicks / maxChartVal) * 100}%`;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Views bar */}
                      <div 
                        className="w-3 md:w-5 bg-[#0F3D2E] rounded-t-sm hover:opacity-90 transition-all duration-500 relative"
                        style={{ height: viewsHeight }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#0F3D2E] text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 transition-transform whitespace-nowrap">
                          {d.views} views
                        </span>
                      </div>
                      {/* Clicks bar */}
                      <div 
                        className="w-3 md:w-5 bg-[#4F46E5] rounded-t-sm hover:opacity-90 transition-all duration-500 relative"
                        style={{ height: clicksHeight }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#4F46E5] text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 transition-transform whitespace-nowrap">
                          {d.clicks} clicks
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#667171] mt-2 block">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Actions & Specs */}
        <aside className="space-y-6">
          {/* Quick Actions Card */}
          <div className="rounded-3xl border border-[#E4E3E3] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-black mb-4">Quick Campaign Actions</h3>
            
            <div className="space-y-3">
              {/* Toggle Start/Pause */}
              {!isOutOfFuel && (
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#E4E3E3] bg-white px-4 py-3.5 text-sm font-semibold text-[#0F3D2E] hover:bg-gray-50 transition"
                >
                  {ad.status === "ACTIVE" ? (
                    <>
                      <Pause size={16} /> Pause Campaign
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Start Campaign
                    </>
                  )}
                </button>
              )}

              {/* Fund campaign */}
              <button
                type="button"
                onClick={handleFundCampaign}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white transition ${
                  isOutOfFuel ? "bg-[#EF4444] hover:bg-[#DC2626]" : "bg-[#0F3D2E] hover:bg-[#185541]"
                }`}
              >
                <Wallet size={16} /> Refuel Campaign Budget
              </button>

              {/* Delete Campaign */}
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-200 text-red-500 px-4 py-3.5 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-60"
              >
                <Trash2 size={16} /> {isDeleting ? "Deleting..." : "Delete Campaign"}
              </button>
            </div>
          </div>

          {/* Campaign Specs list card */}
          <div className="rounded-3xl border border-[#E4E3E3] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-black mb-4">Campaign Specifications</h3>
            
            <div className="space-y-4">
              {/* Placement */}
              <div className="flex items-start gap-3">
                <span className="text-[#667171] mt-0.5"><Layers size={15} /></span>
                <div>
                  <span className="text-[10px] text-[#667171] uppercase tracking-wider block font-bold">Placement Slot</span>
                  <span className="text-xs font-semibold text-black leading-relaxed">{ad.placementSlot}</span>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-start gap-3">
                <span className="text-[#667171] mt-0.5"><Tag size={15} /></span>
                <div>
                  <span className="text-[10px] text-[#667171] uppercase tracking-wider block font-bold">Category</span>
                  <span className="text-xs font-semibold text-black leading-relaxed">{ad.category}</span>
                </div>
              </div>

              {/* Target Audience */}
              <div className="flex items-start gap-3">
                <span className="text-[#667171] mt-0.5"><Users size={15} /></span>
                <div>
                  <span className="text-[10px] text-[#667171] uppercase tracking-wider block font-bold">Target Audience</span>
                  <span className="text-xs font-semibold text-black leading-relaxed">{ad.targetAudience}</span>
                </div>
              </div>

              {/* Daily Budget limit */}
              <div className="flex items-start gap-3">
                <span className="text-[#667171] mt-0.5"><Wallet size={15} /></span>
                <div>
                  <span className="text-[10px] text-[#667171] uppercase tracking-wider block font-bold">Daily Bidding Budget</span>
                  <span className="text-xs font-semibold text-black leading-relaxed">
                    ₦{ad.dailyBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })} / day
                  </span>
                </div>
              </div>

              {/* Duration dates */}
              <div className="flex items-start gap-3">
                <span className="text-[#667171] mt-0.5"><Calendar size={15} /></span>
                <div>
                  <span className="text-[10px] text-[#667171] uppercase tracking-wider block font-bold">Campaign Duration</span>
                  <span className="text-xs font-semibold text-black leading-relaxed">
                    {ad.startDate} to {ad.endDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* EscrowAfrica Secure Seal */}
          <div className="rounded-3xl border border-[#E4E3E3] bg-[#FAFBFA] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F3D2E] mb-2 flex items-center gap-1.5">
              <ShieldCheck size={16} /> Secure Marketplace Policy
            </h3>
            <p className="text-xs text-[#667171] leading-relaxed">
              This promotion campaign complies with EscrowAfrica NG Marketplace Quality Control. Your ad will be distributed only to verified placements.
            </p>
            <Link
              href="/dashboard/help"
              className="mt-3 inline-flex items-center text-xs font-bold text-[#0F3D2E] hover:text-[#185541] transition"
            >
              Read Advertising Policy &rarr;
            </Link>
          </div>

          {/* Need help */}
          <div className="rounded-3xl border border-[#E4E3E3] bg-[#E5F7F0]/30 p-5 text-center flex flex-col items-center">
            <HelpCircle size={24} className="text-[#0F3D2E] mb-2" />
            <p className="text-xs text-[#667171] mb-3">Need assistance with your advertising placement?</p>
            <Link
              href="/dashboard/help"
              className="w-full py-2.5 bg-[#0f3d2e] hover:bg-[#185541] text-white rounded-xl font-bold text-xs transition"
            >
              Contact Support
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

