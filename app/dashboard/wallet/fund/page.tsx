"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FundWalletFlow from "../../../../components/dashboard/wallet/FundWalletFlow";
import { getTokenFromCookie } from "../../../../utils/token";

export default function FundWalletPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getTokenFromCookie();
      if (token) {
        try {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          setUserId(decoded.userId || decoded.id || decoded.sub || null);
        } catch (error) {
          setUserId(null);
        }
      }
    }
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center w-full py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/wallet")}
            className="text-sm font-semibold text-[#0F3D2E] hover:text-[#163f33]"
          >
            ← Back to Wallet
          </button>
        </div>
        <FundWalletFlow onComplete={() => router.push("/dashboard/wallet")} />
      </div>
    </div>
  );
}
