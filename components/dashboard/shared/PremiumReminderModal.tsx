import Link from "next/link";
import React from "react";
import { Megaphone } from "lucide-react";

export default function PremiumReminderModal() {
  return (
    <div className="rounded-3xl bg-[#0F3D2E] p-6 text-white shadow-lg">
      <div className="relative overflow-hidden mb-6">
        <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
          <Megaphone size={160} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-3">Boost Your Sales</h2>
          <p className="text-sm text-[#8BAA9E] leading-relaxed">
            Create an ad today and reach thousands of potential buyers instantly.
          </p>
        </div>
      </div>

      <Link href="/dashboard/ads" className="block">
        <button className="w-full py-3.5 bg-[#F3B659] hover:bg-[#e0a241] text-[#0F3D2E] font-bold rounded-xl transition-colors shadow-lg shadow-[#F3B659]/20">
          Get Started
        </button>
      </Link>
    </div>
  );
}
