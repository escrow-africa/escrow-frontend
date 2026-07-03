"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, MousePointerClick, Wallet } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Line, Legend } from "recharts";
import { fetchAd } from "@/api/ads";
import { Ad } from "@/types/ads";

interface AnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const resolved = React.use(params);
  const id = resolved.id;
  const router = useRouter();

  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "views" | "clicks" | "conversions">("all");

  useEffect(() => {
    fetchAd(id)
      .then((data) => setAd(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  // Generate sample timeseries for the week using ad metrics as seeds
  const series = useMemo(() => {
    const base = ad?.views ?? 200;
    const clicks = ad?.clicks ?? 20;
    const conv = Math.max(0, Math.round((clicks / 10)));
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((d, i) => ({
      day: d,
      views: Math.round(base * (0.4 + Math.abs(Math.sin(i + 1)) * 0.9)),
      clicks: Math.round(clicks * (0.2 + Math.abs(Math.cos(i)) * 1.6)),
      conv: Math.max(0, Math.round(conv * (0.1 + Math.abs(Math.sin(i)))))
    }));
  }, [ad]);

  const totals = useMemo(() => {
    return {
      views: series.reduce((s, x) => s + x.views, 0),
      clicks: series.reduce((s, x) => s + x.clicks, 0),
      conv: series.reduce((s, x) => s + x.conv, 0),
    };
  }, [series]);

  if (isLoading) return <div className="p-8">Loading analytics…</div>;

  return (
    <div className="fade-in max-w-7xl mx-auto px-2 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/dashboard/ads" className="inline-flex items-center text-sm text-[#667171] gap-2">
            <ArrowLeft size={14} /> Back to Lab
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-[#0F3D2E]">{ad?.title || "Advertisement"}</h1>
          <p className="text-sm text-[#667171] mt-1">Cryptographically logged engagement with target marketing slots.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/dashboard/ads/${id}/edit`)} className="rounded-2xl border px-4 py-2 text-sm">Edit Ad</button>
          <button onClick={() => router.push(`/dashboard/ads/${id}`)} className="rounded-2xl bg-[#0F3D2E] px-4 py-2 text-sm text-white">Placement Detail</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <span className="text-xs uppercase tracking-wider text-[#6B7280]">TOTAL VIEWS</span>
              <div className="text-2xl font-extrabold">{totals.views.toLocaleString()}</div>
              <div className="text-xs text-[#667171]">impression slots</div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <span className="text-xs uppercase tracking-wider text-[#6B7280]">TOTAL CLICKS</span>
              <div className="text-2xl font-extrabold">{totals.clicks.toLocaleString()}</div>
              <div className="text-xs text-[#667171]">Click-through CTR: {ad ? ((ad.clicks / Math.max(1, ad.views)) * 100).toFixed(2) : "0.00"}%</div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <span className="text-xs uppercase tracking-wider text-[#6B7280]">CONVERSIONS</span>
              <div className="text-2xl font-extrabold">{totals.conv}</div>
              <div className="text-xs text-[#667171]">inquired orders</div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <span className="text-xs uppercase tracking-wider text-[#6B7280]">COST</span>
              <div className="text-2xl font-extrabold">₦{(ad?.price ? (ad.price / 3500).toFixed(2) : "57.44")}</div>
              <div className="text-xs text-[#667171]">deducted from budget</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Performance Over Time</h3>
              <div className="flex items-center gap-2 bg-[#F7F8F9] p-1 rounded-full">
                {(["all", "views", "clicks", "conversions"] as const).map((mode) => (
                  <button key={mode} onClick={() => setViewMode(mode)} className={`px-3 py-1 rounded-full text-xs ${viewMode===mode?"bg-white shadow-sm":"text-[#667171]"}`}>
                    {mode === "all" ? "ALL" : mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts AreaChart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fill: '#94A3B8' }} />
                  <YAxis tick={{ fill: '#94A3B8' }} />
                  <Tooltip formatter={(value: any, name: string) => [value, name.toUpperCase()]} />
                  <Legend />
                  {(viewMode === 'all' || viewMode === 'views') && (
                    <Area type="monotone" dataKey="views" stackId="1" stroke="#4F46E5" fill="#C7D6FF" fillOpacity={0.6} />
                  )}
                  {(viewMode === 'all' || viewMode === 'clicks') && (
                    <Line type="monotone" dataKey="clicks" stroke="#10B981" dot={{ r: 3 }} />
                  )}
                  {(viewMode === 'all' || viewMode === 'conversions') && (
                    <Area type="monotone" dataKey="conv" stackId="2" stroke="#F59E0B" fill="#FDE68A" fillOpacity={0.6} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <h4 className="text-sm font-bold">ROI Estimator</h4>
            <p className="text-xs text-[#667171] mt-2">Assign a custom monetary value to each lead conversion.</p>
            <div className="mt-4">
              <label className="text-xs text-[#667171]">Conversion Contract Value (₦)</label>
              <input aria-label="Conversion contract value" title="Conversion contract value" defaultValue={12000} className="w-full mt-2 rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between"><span>Estimated Conversion Sales</span><strong>₦500,300</strong></div>
              <div className="flex justify-between mt-2"><span>Campaign Spend Cost</span><strong className="text-red-500">-₦51,250</strong></div>
            </div>
            <div className="mt-4 pt-4">
              <div className="flex justify-between items-center"><span>ESTIMATED PROFIT</span><span className="text-green-600 font-bold">₦449,050</span></div>
              <div className="text-xs text-[#10B981] mt-2">AD ROAS MULTIPLIER +1172.9%</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
