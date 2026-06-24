"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FundWalletFlow from "../../../../components/dashboard/wallet/FundWalletFlow";
import { getTokenFromCookie } from "../../../../utils/token";

function FundWalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);

  const returnTo = searchParams.get("returnTo") || "/dashboard/wallet";
  const escrowId = searchParams.get("escrowId") || null;
  const amountParam = searchParams.get("amount") || "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getTokenFromCookie();
      if (token) {
        try {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          setUserId(decoded.userId || decoded.id || decoded.sub || null);
        } catch {
          setUserId(null);
        }
      }
    }
  }, []);

  const handleComplete = () => {
    router.push(returnTo);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center w-full py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(returnTo)}
            className="text-sm font-semibold text-[#0F3D2E] hover:text-[#163f33]"
          >
            ← {escrowId ? "Back to Escrow" : "Back to Wallet"}
          </button>
        </div>

        {escrowId && amountParam && (
          <div className="mb-4 bg-[#FFF9F2] border border-[#FFE8CC] rounded-xl p-4 text-sm text-[#B0720A] font-medium">
            You need to fund your wallet with at least{" "}
            <span className="font-bold">₦{Number(amountParam).toLocaleString()}</span> to complete this escrow.
            After funding, you&rsquo;ll be returned to the escrow page.
          </div>
        )}

        <FundWalletFlow
          onComplete={handleComplete}
          userId={userId}
          defaultAmount={amountParam}
        />
      </div>
    </div>
  );
}

export default function FundWalletPage() {
  return (
    <Suspense>
      <FundWalletContent />
    </Suspense>
  );
}
