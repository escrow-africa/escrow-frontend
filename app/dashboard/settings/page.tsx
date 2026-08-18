"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Building2,
  Lock,
  Bell,
  CreditCard,
  ShieldCheck,
  Globe,
  ChevronRight,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

// Import Settings Forms
import PersonalInfoForm from "../../../components/dashboard/settings/PersonalInfoForm";
import BillingForm from "../../../components/dashboard/settings/BillingForm";
import SecurityForm from "../../../components/dashboard/settings/SecurityForm";
import AlertPreferencesForm from "../../../components/dashboard/settings/AlertPreferencesForm";
import PayoutMethodsForm from "../../../components/dashboard/settings/PayoutMethodsForm";
import IdentityVerificationForm from "../../../components/dashboard/settings/IdentityVerificationForm";
import PreferencesForm from "../../../components/dashboard/settings/PreferencesForm";
import SyncLoader from "../../../components/dashboard/settings/SyncLoader";

// Import API
import { authApi } from "../../../api/auth";

type ViewType =
  | "main"
  | "personal-info"
  | "billing"
  | "security"
  | "alerts"
  | "payouts"
  | "kyc"
  | "preferences";

export default function SettingsPage() {
  const [activeView, setActiveView] = useState<ViewType>("main");
  const [isSyncing, setIsSyncing] = useState(false);
  
  // User Data State
  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    bio: string;
    avatarUrl?: string;
  }>({
    fullName: "Madeleine Nkiru",
    email: "madeleinenkiru@gmail.com",
    bio: "Professional UI/UX designer with 5+ years of experience in creating modern digital products.",
  });

  // Billing Data State
  const [billingData, setBillingData] = useState({
    companyName: "Madeleine Creative Studio",
    vatId: "VAT-NG-992102",
    billingAddress: "22 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  });

  // Fetch real User Data from API on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await authApi.getMe();
        if (me) {
          setUserData({
            fullName: me.fullName || me.name || "Madeleine Nkiru",
            email: me.email || "madeleinenkiru@gmail.com",
            bio: me.bio || "Professional UI/UX designer with 5+ years of experience in creating modern digital products.",
            avatarUrl: me.avatarUrl || undefined,
          });
          
          // Seed local storage with values from API if not already present
          if (typeof window !== "undefined") {
            if (me.fullName) localStorage.setItem("user_fullName", me.fullName);
            if (me.email) localStorage.setItem("user_email", me.email);
            if (me.avatarUrl) localStorage.setItem("user_avatarUrl", me.avatarUrl);
          }
        }
      } catch (err) {
        // Fallback: Read from LocalStorage if API fails
        if (typeof window !== "undefined") {
          const savedName = localStorage.getItem("user_fullName");
          const savedEmail = localStorage.getItem("user_email");
          const savedAvatar = localStorage.getItem("user_avatarUrl");
          const savedBio = localStorage.getItem("user_bio");

          setUserData({
            fullName: savedName || "Madeleine Nkiru",
            email: savedEmail || "madeleinenkiru@gmail.com",
            bio: savedBio || "Professional UI/UX designer with 5+ years of experience in creating modern digital products.",
            avatarUrl: savedAvatar || undefined,
          });
        }
      }
    };

    loadProfile();
  }, []);

  // Save Handlers
  const handleSaveProfile = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatarUrl?: string;
  }) => {
    setIsSyncing(true);
    // Simulate API save delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const combinedName = `${data.firstName} ${data.lastName}`.trim();
    
    // Update local react state
    setUserData({
      fullName: combinedName,
      email: data.email,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    });

    // Update local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("user_fullName", combinedName);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_bio", data.bio);
      if (data.avatarUrl) {
        localStorage.setItem("user_avatarUrl", data.avatarUrl);
      }
      
      // Dispatch custom event to notify Sidebar/Header of the name change in real-time
      window.dispatchEvent(new Event("user-profile-updated"));
    }

    setIsSyncing(false);
    toast.success("Profile updated successfully!");
    setActiveView("main");
  };

  const handleSaveBilling = async (data: typeof billingData) => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setBillingData(data);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("billing_companyName", data.companyName);
      localStorage.setItem("billing_vatId", data.vatId);
      localStorage.setItem("billing_address", data.billingAddress);
    }
    
    setIsSyncing(false);
    toast.success("Billing details updated successfully!");
    setActiveView("main");
  };

  const handleSaveGeneric = async (data: any) => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSyncing(false);
    setActiveView("main");
  };

  // Get initials for profile fallback
  const getInitials = (name: string) => {
    const parts = (name || "").trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return parts[0]?.charAt(0).toUpperCase() || "M";
  };

  // List of Right Column Settings options
  const settingsOptions = [
    {
      id: "personal-info" as ViewType,
      title: "Personal Information",
      subtitle: "Update your photo, name, and bio",
      icon: User,
    },
    {
      id: "billing" as ViewType,
      title: "Billing & Corporate Details",
      subtitle: "Setup company details and VAT invoices",
      icon: Building2,
    },
    {
      id: "security" as ViewType,
      title: "Security",
      subtitle: "Manage your password and 2FA",
      icon: Lock,
    },
    {
      id: "alerts" as ViewType,
      title: "Alert Preferences",
      subtitle: "Choose what you want to be notified about",
      icon: Bell,
    },
    {
      id: "payouts" as ViewType,
      title: "Payout Methods",
      subtitle: "Manage bank accounts and settlement ledger",
      icon: CreditCard,
    },
    {
      id: "kyc" as ViewType,
      title: "Identity Verification",
      subtitle: "Complete KYC to raise monthly withdrawal limits",
      icon: ShieldCheck,
    },
    {
      id: "preferences" as ViewType,
      title: "Preferences & Localization",
      subtitle: "Configure default currency, language, and timezones",
      icon: Globe,
    },
  ];

  return (
    <div className="flex flex-col min-h-full fade-in pb-36 text-gray-800 dark:text-gray-200 ">
      {/* Loading Sync Spinner */}
      <SyncLoader isOpen={isSyncing} />

      {/* Settings Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary dark:text-[#F3B659] mb-1">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Customize your experience, verify identity parameters, and manage settlement ledgers.
        </p>
      </div>

      {activeView === "main" ? (
        /* Main View with 2 columns */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Profile & Limits) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-[32px] p-8 text-center shadow-2xs relative overflow-hidden">
              {/* Profile Avatar */}
              <div className="relative mx-auto w-24 h-24 mb-4 select-none flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#FAFBFA] dark:bg-zinc-900 border border-[#E4E3E3CC] dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-white text-3xl font-extrabold shadow-inner overflow-hidden">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt={userData.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(userData.fullName)}</span>
                  )}
                </div>
                {/* Visual Camera Indicator */}
                <div
                  onClick={() => setActiveView("personal-info")}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-zinc-800 border border-[#E4E3E3CC] dark:border-zinc-800 rounded-full flex items-center justify-center text-gray-500 hover:text-[#0F3D2E] dark:hover:text-[#F3B659] shadow-sm cursor-pointer transition-colors"
                >
                  <ImageIcon size={14} />
                </div>
              </div>

              {/* Name & Email */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate mb-1">
                {userData.fullName}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-4">
                {userData.email}
              </p>

              {/* Verification Tag */}
              <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] dark:bg-emerald-950/20 border border-[#A5D6A7] dark:border-emerald-900/40 text-[#2E7D32] dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                <ShieldCheck size={12} className="shrink-0 text-[#2E7D32] dark:text-emerald-400" />
                <span>Verified Broker</span>
              </div>
            </div>

            {/* Monthly Trading Limits Card */}
            <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-[32px] p-6 shadow-2xs">
              <span className="text-[10px] text-gray-450 dark:text-gray-500 uppercase font-bold tracking-wider block mb-4">
                Monthly Trading Limits
              </span>

              {/* KYC Tier */}
              <div className="flex justify-between items-center text-xs font-semibold mb-3">
                <span className="text-gray-500 dark:text-gray-400">KYC Verification Tier:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tier 2 Verified</span>
              </div>

              {/* Dispersal limits */}
              <div className="flex justify-between items-center text-xs mb-3">
                <span className="text-gray-500 dark:text-gray-400">Monthly dispersal Limit:</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  ₦1,500,000 / <span className="text-gray-400 dark:text-zinc-600">₦5,000,000</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#FAFBFA] dark:bg-zinc-900 border border-[#E4E3E3CC] dark:border-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-[#0F3D2E] dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: "30%" }}
                ></div>
              </div>

              {/* Verified Upgrade Banner Info */}
              <div className="flex items-start gap-2 text-[11px] leading-relaxed text-[#2E7D32] dark:text-emerald-400">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <span>Limits raised to ₦50,000,000 monthly. Your premium compliance badge is active.</span>
              </div>
            </div>
          </div>

          {/* Right Column (Settings Menu List) */}
          <div className="lg:col-span-8 space-y-3">
            {settingsOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  onClick={() => setActiveView(opt.id)}
                  className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:border-[#0F3D2E] dark:hover:border-emerald-500 cursor-pointer transition-all group duration-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Left Icon Container */}
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-[#E4E3E3CC] dark:border-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800 transition-colors duration-200">
                      <Icon size={18} />
                    </div>

                    {/* Meta info */}
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base group-hover:text-[#0F3D2E] dark:group-hover:text-[#F3B659] transition-colors">
                        {opt.title}
                      </h3>
                      <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Chevron Right */}
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-[#0F3D2E] dark:group-hover:text-[#F3B659] transition-all duration-200 group-hover:translate-x-0.5"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Sub Views */
        <div className="w-full">
          {activeView === "personal-info" && (
            <PersonalInfoForm
              initialData={userData}
              onCancel={() => setActiveView("main")}
              onSave={handleSaveProfile}
            />
          )}

          {activeView === "billing" && (
            <BillingForm
              initialData={billingData}
              onCancel={() => setActiveView("main")}
              onSave={handleSaveBilling}
            />
          )}

          {activeView === "security" && (
            <SecurityForm
              onCancel={() => setActiveView("main")}
              onSave={handleSaveGeneric}
              billingAddress={billingData.billingAddress}
            />
          )}

          {activeView === "alerts" && (
            <AlertPreferencesForm
              onCancel={() => setActiveView("main")}
              onSave={handleSaveGeneric}
            />
          )}

          {activeView === "payouts" && (
            <PayoutMethodsForm
              onCancel={() => setActiveView("main")}
              onSave={handleSaveGeneric}
            />
          )}

          {activeView === "kyc" && (
            <IdentityVerificationForm
              onCancel={() => setActiveView("main")}
              onSave={handleSaveGeneric}
            />
          )}

          {activeView === "preferences" && (
            <PreferencesForm
              onCancel={() => setActiveView("main")}
              onSave={handleSaveGeneric}
            />
          )}
        </div>
      )}
    </div>
  );
}
