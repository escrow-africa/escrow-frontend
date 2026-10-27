"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Megaphone, Sparkles, Target, TrendingUp, ShieldCheck } from "lucide-react";

export default function AdsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full fade-in pb-36 text-gray-800 dark:text-gray-200">
      {/* Back Link */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0F3D2E] dark:hover:text-[#F3B659] transition-colors font-semibold text-sm focus:outline-none cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Section */}
      <div className="max-w-4xl mx-auto w-full">
        {/* Creative Billboard Hero Card */}
        <div className="bg-[#0F3D2E] text-white rounded-[32px] p-8 md:p-12 relative overflow-hidden mb-8 shadow-lg">
          {/* Decorative background grid and shapes */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[10%] w-72 h-72 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Text details */}
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-[#F3B659]/20 border border-[#F3B659]/30 text-[#F3B659] px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                <Sparkles size={12} className="animate-pulse" />
                <span>Coming Q4 2026</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Advertise with <br className="hidden md:inline" />
                <span className="text-[#F3B659]">Escrow Protection</span>
              </h1>
              <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">
                Connect your business directly to verified brokers, buyers, and high-volume merchant networks. Funding and conversion yields are secured natively by the EscrowAfrica ledger.
              </p>
            </div>

            {/* Megaphone Graphic */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative animate-swing">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#185541] flex items-center justify-center shadow-inner">
                  <Megaphone size={48} className="text-[#F3B659]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Target */}
          <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/5 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
              <Target size={20} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 font-sans">Hyper-Targeted</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Showcase your services and inventory directly to high-intent buyers co-signing active contracts.
            </p>
          </div>

          {/* Performance */}
          <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 font-sans">Pay on Conversion</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Deduct ad budgets only when customers trigger transaction milestones or secure co-signs.
            </p>
          </div>

          {/* Escrow Lock */}
          <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 font-sans">Vetted Directory</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Prevent bot clicks. Only verified profiles with cleared compliance tiers can interact with ads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
