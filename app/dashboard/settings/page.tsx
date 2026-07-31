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
    <div className="flex flex-col h-full fade-in pb-20 text-gray-800 dark:text-gray-200">
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
            <div className="bg-white dark:bg-[#18181b] border border-border dark:border-zinc-800 rounded-2xl p-6 text-center shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-[#0F3D2E] dark:bg-[#185541]"></div>
              
              {/* Profile Avatar */}
              <div className="mx-auto w-24 h-24 rounded-full bg-[#E5ECE9] dark:bg-[#1f2937] border-2 border-white dark:border-zinc-900 shadow-md flex items-center justify-center text-primary dark:text-[#F3B659] text-3xl font-extrabold relative overflow-hidden select-none mb-4 mt-2">
                {userData.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt={userData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(userData.fullName)}</span>
                )}
                {/* Visual Camera Indicator on Hover */}
                <div
                  onClick={() => setActiveView("personal-info")}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera size={20} />
                </div>
              </div>

              {/* Name & Email */}
              <h2 className="text-lg font-bold text-[#0F3D2E] dark:text-[#F3B659] truncate px-2">
                {userData.fullName}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate px-2">
                {userData.email}
              </p>

              {/* Verification Tag */}
              <div className="mt-4 inline-flex items-center gap-1 bg-[#0F3D2E]/[0.06] dark:bg-[#185541]/20 border border-[#0F3D2E]/20 text-[#0F3D2E] dark:text-emerald-400 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                <ShieldCheck size={12} className="shrink-0" />
                <span>Verified Broker</span>
              </div>
            </div>

            {/* Monthly Trading Limits Card */}
            <div className="bg-white dark:bg-[#18181b] border border-border dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider block mb-3">
                Monthly Trading Limits
              </span>

              {/* KYC Tier */}
              <div className="flex justify-between items-center text-xs font-semibold mb-3">
                <span className="text-gray-500 dark:text-gray-400">KYC Verification Tier:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tier 2 Verified</span>
              </div>

              {/* Dispersal limits */}
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-500 dark:text-gray-400">Monthly dispersal Limit:</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  ₦1,500,000 / <span className="text-gray-400 dark:text-gray-600">₦5,000,000</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-5">
                <div
                  className="bg-[#0F3D2E] dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: "30%" }}
                ></div>
              </div>

              {/* Footer upgrade notice */}
              <p className="text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                Need to process over ₦50,000,000 monthly?{" "}
                <button
                  onClick={() => setActiveView("kyc")}
                  className="text-[#0F3D2E] dark:text-[#F3B659] hover:underline font-bold focus:outline-none"
                >
                  Upload corporate tax certificates under the Identity Verification tab.
                </button>
              </p>
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
                  className="bg-white dark:bg-[#18181b] border border-border dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between shadow-xs hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-700 cursor-pointer transition-all group duration-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Left Icon Container */}
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-primary dark:text-[#F3B659] shrink-0 transition-transform group-hover:scale-105 duration-200">
                      <Icon size={18} />
                    </div>

                    {/* Meta info */}
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base group-hover:text-primary dark:group-hover:text-[#F3B659] transition-colors">
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
                    className="text-gray-400 group-hover:text-primary dark:group-hover:text-[#F3B659] transition-all duration-200 group-hover:translate-x-0.5"
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
