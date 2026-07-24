"use client";

import React, { useState, useEffect } from "react";
import { useWalletStore } from "../../../store/walletStore";
import { Check, ChevronRight, CreditCard, ShieldCheck, Loader2 } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  description: string;
  benefits: string[];
  buttonText: string;
}

export default function SubscriptionPage() {
  const { walletDetails, fetchWalletDetails } = useWalletStore();
  const [activeTier, setActiveTier] = useState<string>("Premium Enterprise");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  // Checkout flow state: "checkout" | "processing" | "success" | null
  const [modalState, setModalState] = useState<"checkout" | "processing" | "success" | null>(null);

  useEffect(() => {
    // Load initial active tier from localStorage or default to "Premium Enterprise"
    if (typeof window !== "undefined") {
      const savedTier = localStorage.getItem("escrow_subscription_tier");
      if (savedTier) {
        setActiveTier(savedTier);
      }
    }
    // Fetch wallet details to get actual balance
    fetchWalletDetails().catch((err) => console.error("Error loading wallet:", err));
  }, [fetchWalletDetails]);

  // Available Subscription Plans
  const plans: Plan[] = [
    {
      id: "free",
      name: "Free (Default)",
      price: 0,
      priceDisplay: "₦0",
      description: "Standard secure custodian safeguards.",
      benefits: [
        "1.5% Escrow commission fee",
        "Standard mediation queue (72h response)",
        "Max escrow volume ₦750,000 per contract",
        "Email ticket support",
      ],
      buttonText: "UPGRADE ACCOUNT",
    },
    {
      id: "pro",
      name: "Pro Safeguard",
      price: 20000,
      priceDisplay: "₦20000",
      description: "Optimal for active builders & agencies.",
      benefits: [
        "0.8% Escrow commission fee",
        "Express mediation ticket triage (24h)",
        "Max escrow volume ₦10,000,000 per contract",
        "Automatic custom NDA legal drafts",
        "Priority Slack ticket integrations",
      ],
      buttonText: "UPGRADE ACCOUNT",
    },
    {
      id: "premium",
      name: "Premium Enterprise",
      price: 50000,
      priceDisplay: "₦50000",
      description: "Elite zero-commission broker tier.",
      benefits: [
        "0.0% Custom commission fees (Enterprise)",
        "Direct 24/7 Legal Mediation Hotline",
        "Unlimited escrow contract limits",
        "Dedicated account lawyer assigned to legal drafts",
        "White-label broker escrow contracts",
      ],
      buttonText: "UPGRADE ACCOUNT",
    },
  ];

  // Dynamic description text for active banner
  const getBannerDescription = (tier: string) => {
    switch (tier) {
      case "Free (Default)":
        return "Enjoy standard secure custodian safeguards, standard mediation support, and essential escrow tools.";
      case "Pro Safeguard":
        return "Optimal protection with lower escrow commissions, 24-hour express ticket triage, and automated custom NDA drafts.";
      case "Premium Enterprise":
      default:
        return "Enjoy advanced multi-signature escrow custody, expert legal arbitrations, and swift disbursement protocols.";
    }
  };

  const handlePlanClick = (plan: Plan) => {
    if (activeTier === plan.name) return; // Already active
    setSelectedPlan(plan);
    setModalState("checkout");
  };

  const handleConfirmUpgrade = () => {
    setModalState("processing");
    // Simulate API request delay
    setTimeout(() => {
      if (selectedPlan) {
        // Persist the upgraded tier
        localStorage.setItem("escrow_subscription_tier", selectedPlan.name);
        setActiveTier(selectedPlan.name);
      }
      setModalState("success");
    }, 1500);
  };

  const handleDismiss = () => {
    setModalState(null);
    setSelectedPlan(null);
  };

  // Balance formatting
  const rawBalance = walletDetails?.balance !== undefined ? walletDetails.balance : 202000;
  const formattedBalance = `₦${rawBalance.toLocaleString()} NGN`;

  return (
    <div className="flex flex-col gap-8 pb-20 animate-fade-in font-sans">
      {/* Top Banner - Current Active Tier */}
      <div className="relative bg-[#082218] dark:bg-[#051D16] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 z-10 max-w-xl">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Tier: {activeTier}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 font-normal leading-relaxed opacity-90">
            {getBannerDescription(activeTier)}
          </p>
        </div>
        
        <div className="md:text-right shrink-0 z-10">
          <p className="text-[10px] md:text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">
            Renews On
          </p>
          <p className="text-sm md:text-base font-bold text-white">
            July 16, 2026 <span className="text-xs font-normal text-emerald-400">(Auto-Clears)</span>
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isActive = activeTier === plan.name;
          const isPro = plan.id === "pro";
          
          return (
            <div
              key={plan.id}
              className={`relative bg-surface rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 border hover:shadow-lg ${
                isActive 
                  ? "border-[#E4E3E3CC] dark:border-gray-800" 
                  : isPro 
                    ? "border-[#0B493A] shadow-sm" 
                    : "border-[#E4E3E3CC] dark:border-gray-800"
              }`}
            >
              {/* Most Recommended Badge */}
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0B493A] text-white text-[9px] tracking-widest px-4 py-1.5 font-bold rounded-full uppercase shadow-sm">
                  ★ Most Recommended
                </div>
              )}

              <div>
                {/* Title & Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-normal">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-3xl md:text-4xl font-extrabold text-foreground">
                    {plan.priceDisplay}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    / month
                  </span>
                </div>

                <div className="border-t border-[#E4E3E3CC] dark:border-gray-800 my-6" />

                {/* Checklist Label */}
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  Waiver Benefits:
                </p>

                {/* Benefits List */}
                <ul className="space-y-4 mb-8">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-xs md:text-sm">
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

              {/* Action Button */}
              <button
                disabled={isActive}
                onClick={() => handlePlanClick(plan)}
                className={`w-full py-3.5 px-5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-[#FAFBFA] dark:bg-gray-800/40 text-muted-foreground/60 cursor-not-allowed"
                    : isPro
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

      {/* Custody Comparison Matrix */}
      <div className="bg-surface rounded-3xl border border-[#E4E3E3CC] dark:border-gray-800 p-6 md:p-8 mt-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="mb-6">
          <h3 className="text-base md:text-lg font-bold text-foreground mb-1 uppercase tracking-tight">
            Buyer Custody Rights Comparison
          </h3>
          <p className="text-xs text-muted-foreground">
            Explore advanced buyer protection, legal mediation tiers, and transaction capabilities.
          </p>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full -mx-6 md:-mx-8 px-6 md:px-8">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E4E3E3CC] dark:border-gray-800">
                <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider w-1/4">
                  Protection Asset
                </th>
                <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center w-1/4">
                  Free Safeguard
                </th>
                <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center w-1/4">
                  Pro Safeguard
                </th>
                <th className="py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center w-1/4">
                  Premium Enterprise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E3E3CC] dark:divide-gray-800/60 text-xs md:text-sm">
              <tr>
                <td className="py-4 font-bold text-foreground">Escrow Commission Rate</td>
                <td className="py-4 text-center text-muted-foreground">1.5%</td>
                <td className="py-4 text-center text-[#0B493A] dark:text-emerald-400 font-semibold">0.8%</td>
                <td className="py-4 text-center text-muted-foreground">0.0% (No Fee)</td>
              </tr>
              <tr>
                <td className="py-4 font-bold text-foreground">Mediator SLA Response</td>
                <td className="py-4 text-center text-muted-foreground">72 Hours standard queue</td>
                <td className="py-4 text-center text-[#0B493A] dark:text-emerald-400 font-semibold">24 Hours express queue</td>
                <td className="py-4 text-center text-muted-foreground">Live phone hotline (Instant)</td>
              </tr>
              <tr>
                <td className="py-4 font-bold text-foreground">Max Escrow Volume</td>
                <td className="py-4 text-center text-muted-foreground">₦750,000 per contract</td>
                <td className="py-4 text-center text-muted-foreground">₦10,000,000 per contract</td>
                <td className="py-4 text-center text-[#0B493A] dark:text-emerald-400 font-semibold">Unlimited volume</td>
              </tr>
              <tr>
                <td className="py-4 font-bold text-foreground">Contract NDA Builders</td>
                <td className="py-4 text-center text-muted-foreground">Not Included</td>
                <td className="py-4 text-center text-[#0B493A] dark:text-emerald-400 font-semibold">Custom draft generator</td>
                <td className="py-4 text-center text-muted-foreground">White-label + dedicated lawyers</td>
              </tr>
              <tr>
                <td className="py-4 font-bold text-foreground">Priority Mediation Panel</td>
                <td className="py-4 text-center text-muted-foreground">Standard panel</td>
                <td className="py-4 text-center text-muted-foreground">Senior mediators</td>
                <td className="py-4 text-center text-muted-foreground font-semibold">Head of Compliance arbitration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal System */}
      {modalState && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative flex flex-col items-center text-center animate-scale-in">
            
            {/* Modal Icon Badge */}
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

            {/* Modal Titles & Descriptions */}
            {modalState === "checkout" && (
              <>
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-1">
                  Checkout Upgrade Order
                </h4>
                <p className="text-[11px] text-[#0B493A] dark:text-emerald-400 font-semibold mb-6">
                  Verify details and authorize transaction.
                </p>

                {/* Details Card */}
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

                {/* Action Buttons */}
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
                  Your custody safeguard has been successfully deployed. Zero-commission and prioritized SLA are now active on your buyer profile!
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
