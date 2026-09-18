"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWalletStore } from "../../../store/walletStore";
import { Check, ChevronRight, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { subscriptionApi, type SubscriptionPlan } from "../../../api/subscription";

export default function SubscriptionPage() {
  const { walletDetails, fetchWalletDetails } = useWalletStore();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<string>("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [renewsOn, setRenewsOn] = useState<string | null>(null);
  const [autoRenew, setAutoRenew] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [modalState, setModalState] = useState<"checkout" | "processing" | "success" | null>(null);

  const loadSubscription = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setIsLoading(true);
    try {
      const [fetchedPlans, status] = await Promise.all([
        subscriptionApi.getPlans(),
        subscriptionApi.getStatus(),
      ]);

      setPlans(fetchedPlans);

      const matchedPlan =
        fetchedPlans.find((plan) => status.planId && plan.id === status.planId)
        || fetchedPlans.find((plan) => status.planName && plan.name.toLowerCase() === status.planName.toLowerCase());

      setActivePlanId(matchedPlan?.id ?? status.planId);
      setActiveTier(matchedPlan?.name || status.planName || "No active plan");
      setBannerDescription(status.description || matchedPlan?.description || "Your current subscription safeguard is active.");
      setRenewsOn(status.renewsOn);
      setAutoRenew(status.autoRenew);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        || "Failed to load subscription details.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
    fetchWalletDetails().catch((err) => console.error("Error loading wallet:", err));
  }, [loadSubscription, fetchWalletDetails]);

  const formatRenewDate = (value: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePlanClick = (plan: SubscriptionPlan) => {
    if (activePlanId === plan.id || activeTier === plan.name) return;
    setSelectedPlan(plan);
    setModalState("checkout");
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;
    setModalState("processing");
    try {
      await subscriptionApi.upgrade(selectedPlan.id);
      await loadSubscription({ silent: true });
      await fetchWalletDetails();
      setModalState("success");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        || "Failed to upgrade subscription.";
      toast.error(message);
      setModalState("checkout");
    }
  };

  const handleDismiss = () => {
    setModalState(null);
    setSelectedPlan(null);
  };

  const rawBalance = walletDetails?.balance !== undefined ? walletDetails.balance : 0;
  const formattedBalance = `₦${rawBalance.toLocaleString()} NGN`;

  return (
    <div className="flex flex-col gap-8 pb-20 animate-fade-in font-sans">
      <div className="relative bg-[#082218] dark:bg-[#051D16] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10 max-w-xl">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            {isLoading ? "Loading subscription..." : `Tier: ${activeTier || "—"}`}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 font-normal leading-relaxed opacity-90">
            {isLoading ? "Fetching your current safeguard details." : bannerDescription}
          </p>
        </div>

        <div className="md:text-right shrink-0 z-10">
          <p className="text-[10px] md:text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">
            Renews On
          </p>
          <p className="text-sm md:text-base font-bold text-white">
            {isLoading ? "—" : formatRenewDate(renewsOn)}{" "}
            {!isLoading && autoRenew && (
              <span className="text-xs font-normal text-emerald-400">(Auto-Clears)</span>
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {[0, 1, 2].map((key) => (
            <div
              key={key}
              className="bg-surface rounded-3xl p-6 md:p-8 min-h-[320px] border border-[#E4E3E3CC] dark:border-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isActive = activePlanId === plan.id || activeTier === plan.name;
            const isRecommended = plan.recommended || (!plans.some((item) => item.recommended) && index === 1);

            return (
              <div
                key={plan.id}
                className={`relative bg-surface rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 border hover:shadow-lg ${
                  isActive
                    ? "border-[#E4E3E3CC] dark:border-gray-800"
                    : isRecommended
                      ? "border-[#0B493A] shadow-sm"
                      : "border-[#E4E3E3CC] dark:border-gray-800"
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0B493A] text-white text-[9px] tracking-widest px-4 py-1.5 font-bold rounded-full uppercase shadow-sm">
                    ★ Most Recommended
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-3xl md:text-4xl font-extrabold text-foreground">
                      {plan.priceDisplay}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      / month
                    </span>
                  </div>

                  <div className="border-t border-[#E4E3E3CC] dark:border-gray-800 my-6" />

                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Waiver Benefits:
                  </p>

                  <ul className="space-y-4 mb-8">
                    {plan.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-3 text-xs md:text-sm">
                        <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-0.5 rounded-full mt-0.5">
                          <Check size={13} className="stroke-[3]" />
                        </div>
                        <span className="text-foreground/90 font-medium leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isActive}
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-3.5 px-5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isActive
                      ? "bg-[#FAFBFA] dark:bg-gray-800/40 text-muted-foreground/60 cursor-not-allowed"
                      : isRecommended
                        ? "bg-[#0B493A] text-white hover:bg-[#0B493A]/90 hover:scale-[1.01]"
                        : "bg-[#FAFBFA] dark:bg-gray-800 text-[#0F3D2E] dark:text-gray-100 border border-[#E4E3E3CC] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.01]"
                  }`}
                >
                  {isActive ? (
                    "ACTIVE SAFEGUARD"
                  ) : (
                    <>
                      UPGRADE ACCOUNT <ChevronRight size={14} className="stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && plans.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          No subscription plans are available right now.
        </p>
      )}

      {!isLoading && plans.length > 0 && (
        <div className="bg-surface rounded-3xl border border-[#E4E3E3CC] dark:border-gray-800 p-6 md:p-8 mt-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="mb-6">
            <h3 className="text-base md:text-lg font-bold text-foreground mb-1 uppercase tracking-tight">
              Buyer Custody Rights Comparison
            </h3>
            <p className="text-xs text-muted-foreground">
              Explore advanced buyer protection, legal mediation tiers, and transaction capabilities.
            </p>
          </div>

          <div className="overflow-x-auto w-full -mx-6 md:-mx-8 px-6 md:px-8">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E4E3E3CC] dark:border-gray-800">
                  <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider w-1/4">
                    Protection Asset
                  </th>
                  {plans.slice(0, 3).map((plan) => (
                    <th
                      key={plan.id}
                      className="py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center w-1/4"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E3E3CC] dark:divide-gray-800/60 text-xs md:text-sm">
                {Array.from(
                  new Set(plans.flatMap((plan) => plan.benefits))
                ).map((benefit) => (
                  <tr key={benefit}>
                    <td className="py-4 font-bold text-foreground">{benefit}</td>
                    {plans.slice(0, 3).map((plan) => (
                      <td key={plan.id} className="py-4 text-center text-muted-foreground">
                        {plan.benefits.includes(benefit) ? (
                          <span className="text-[#0B493A] dark:text-emerald-400 font-semibold">Included</span>
                        ) : (
                          "—"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalState && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative flex flex-col items-center text-center animate-scale-in">
            {modalState === "checkout" && (
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-100 dark:border-emerald-500/20 rounded-full flex items-center justify-center text-[#0B493A] dark:text-emerald-400 mb-5">
                <CreditCard size={24} className="stroke-[2]" />
              </div>
            )}

            {modalState === "processing" && (
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full flex items-center justify-center text-[#0B493A] dark:text-emerald-400 mb-5 animate-spin">
                <Loader2 size={24} className="stroke-[2]" />
              </div>
            )}

            {modalState === "success" && (
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-5">
                <ShieldCheck size={28} className="stroke-[2.5]" />
              </div>
            )}

            {modalState === "checkout" && (
              <>
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-1">
                  Checkout Upgrade Order
                </h4>
                <p className="text-[11px] text-[#0B493A] dark:text-emerald-400 font-semibold mb-6">
                  Verify details and authorize transaction.
                </p>

                <div className="w-full bg-[#FAFBFA] dark:bg-gray-800/40 border border-[#E4E3E3CC] dark:border-gray-800 rounded-2xl p-4 mb-6 text-left space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Upgrading to:</span>
                    <span className="font-bold text-foreground">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Setup cost:</span>
                    <span className="font-bold text-foreground">₦{selectedPlan.price.toLocaleString()} NGN</span>
                  </div>
                  <div className="w-full border-t border-gray-205 dark:border-gray-700" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Wallet Balance:</span>
                    <span className="font-bold text-foreground">{formattedBalance}</span>
                  </div>
                </div>

                <div className="w-full flex gap-3">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={handleConfirmUpgrade}
                    className="flex-1 py-3 px-4 bg-[#0B493A] dark:bg-[#185541] hover:bg-[#0B493A]/90 dark:hover:bg-[#185541]/90 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              </>
            )}

            {modalState === "processing" && (
              <div className="py-4">
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-1">
                  Processing Subscription Setup
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2 px-4">
                  Establishing priority mediator channel...
                </p>
              </div>
            )}

            {modalState === "success" && (
              <>
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-1">
                  Subscription Verified
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2 mb-6 px-2">
                  Your custody safeguard has been successfully deployed. Your selected plan is now active on your profile.
                </p>

                <button
                  onClick={handleDismiss}
                  className="w-full py-3 px-5 bg-[#0B493A] dark:bg-[#185541] hover:bg-[#0B493A]/90 dark:hover:bg-[#185541]/90 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Return to Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
