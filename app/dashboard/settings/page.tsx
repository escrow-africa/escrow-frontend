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
import { settingsApi } from "../../../api/settings";

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

  // Notification Preferences State
  const [notificationData, setNotificationData] = useState({
    escrowContractReleases: true,
    dispersalClearingAlerts: true,
    disputeArbitrationWarning: true,
    tipsPromotionalAnalytics: false,
  });

  // Preferences State
  const [preferencesData, setPreferencesData] = useState({
    currency: "NGN",
    language: "en-US",
    timezone: "GMT+1",
  });

  // KYC Status State
  const [kycStatus, setKycStatus] = useState({
    tier: "Tier 2 Verified",
    dispersalLimitUsed: 1500000,
    dispersalLimitTotal: 5000000,
    status: "verified",
  });

  // Fetch real User Data & settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      // 1. Fetch Profile
      try {
        const me = await authApi.getMe();
        if (me) {
          const fullName = me.fullName || `${me.firstName || ""} ${me.lastName || ""}`.trim() || "Madeleine Nkiru";
          setUserData({
            fullName,
            email: me.email || "madeleinenkiru@gmail.com",
            bio: me.bio || "Professional UI/UX designer with 5+ years of experience in creating modern digital products.",
            avatarUrl: me.avatarUrl || undefined,
          });
          
          if (typeof window !== "undefined") {
            localStorage.setItem("user_fullName", fullName);
            if (me.email) localStorage.setItem("user_email", me.email);
            if (me.avatarUrl) localStorage.setItem("user_avatarUrl", me.avatarUrl);
          }
        }
      } catch (err) {
        console.error("Error loading profile from API, using fallback", err);
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

      // 2. Fetch Billing Information
      try {
        const billing = await settingsApi.getBilling();
        if (billing) {
          setBillingData({
            companyName: billing.companyName || "Madeleine Creative Studio",
            vatId: billing.vatId || "VAT-NG-992102",
            billingAddress: billing.billingAddress || "22 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
          });
        }
      } catch (err) {
        console.error("Error loading billing info from API, using fallback", err);
        if (typeof window !== "undefined") {
          const savedComp = localStorage.getItem("billing_companyName");
          const savedVat = localStorage.getItem("billing_vatId");
          const savedAddr = localStorage.getItem("billing_address");
          setBillingData({
            companyName: savedComp || "Madeleine Creative Studio",
            vatId: savedVat || "VAT-NG-992102",
            billingAddress: savedAddr || "22 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
          });
        }
      }

      // 3. Fetch Notification Preferences
      try {
        const notifications = await settingsApi.getNotificationPreferences();
        if (notifications) {
          setNotificationData({
            escrowContractReleases: notifications.escrowContractReleases ?? true,
            dispersalClearingAlerts: notifications.dispersalClearingAlerts ?? true,
            disputeArbitrationWarning: notifications.disputeArbitrationWarning ?? true,
            tipsPromotionalAnalytics: notifications.tipsPromotionalAnalytics ?? false,
          });
        }
      } catch (err) {
        console.error("Error loading notification preferences from API", err);
      }

      // 4. Fetch Localization Preferences
      try {
        const preferences = await settingsApi.getPreferences();
        if (preferences) {
          setPreferencesData({
            currency: preferences.currency || "NGN",
            language: preferences.language || "en-US",
            timezone: preferences.timezone || "GMT+1",
          });
        }
      } catch (err) {
        console.error("Error loading preferences from API", err);
      }

      // 5. Fetch KYC status
      try {
        const kyc = await settingsApi.getKycStatus();
        if (kyc) {
          setKycStatus({
            tier: kyc.tier || "Tier 2 Verified",
            dispersalLimitUsed: kyc.dispersalLimitUsed ?? 1500000,
            dispersalLimitTotal: kyc.dispersalLimitTotal ?? 5000000,
            status: kyc.status || "verified",
          });
        }
      } catch (err) {
        console.error("Error loading KYC status from API", err);
      }
    };

    loadSettings();
  }, []);

  // Save Handlers
  const handleSaveProfile = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatarUrl?: string;
    avatarFile?: File;
  }) => {
    setIsSyncing(true);
    try {
      // 1. Update core fields via PATCH /auth/me
      await settingsApi.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
      });

      // 2. Upload avatar if a new image file is chosen
      let finalAvatarUrl = data.avatarUrl;
      if (data.avatarFile) {
        const formData = new FormData();
        formData.append("avatar-file", data.avatarFile);
        const avatarRes = await settingsApi.uploadAvatar(formData);
        if (avatarRes && avatarRes.avatarUrl) {
          finalAvatarUrl = avatarRes.avatarUrl;
        } else if (avatarRes && avatarRes.url) {
          finalAvatarUrl = avatarRes.url;
        }
      }
      
      const combinedName = `${data.firstName} ${data.lastName}`.trim();
      
      // Update local react state
      setUserData({
        fullName: combinedName,
        email: data.email,
        bio: data.bio,
        avatarUrl: finalAvatarUrl,
      });

      // Update local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("user_fullName", combinedName);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_bio", data.bio);
        if (finalAvatarUrl) {
          localStorage.setItem("user_avatarUrl", finalAvatarUrl);
        }
        
        // Dispatch custom event to notify Sidebar/Header of the name change in real-time
        window.dispatchEvent(new Event("user-profile-updated"));
      }

      toast.success("Profile updated successfully!");
      setActiveView("main");
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveBilling = async (data: typeof billingData) => {
    setIsSyncing(true);
    try {
      await settingsApi.updateBilling(data);
      setBillingData(data);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("billing_companyName", data.companyName);
        localStorage.setItem("billing_vatId", data.vatId);
        localStorage.setItem("billing_address", data.billingAddress);
      }
      toast.success("Billing details updated successfully!");
      setActiveView("main");
    } catch (err) {
      toast.error("Failed to save billing information.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveNotifications = async (data: typeof notificationData) => {
    setIsSyncing(true);
    try {
      await settingsApi.updateNotificationPreferences(data);
      setNotificationData(data);
      toast.success("Notification preferences saved successfully!");
      setActiveView("main");
    } catch (err) {
      toast.error("Failed to save notification preferences.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSavePreferences = async (data: typeof preferencesData) => {
    setIsSyncing(true);
    try {
      await settingsApi.updatePreferences(data);
      setPreferencesData(data);
      toast.success("Preferences saved successfully!");
      setActiveView("main");
    } catch (err) {
      toast.error("Failed to save preferences.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveKyc = async (data: { documentType: string; file: File }) => {
    setIsSyncing(true);
    try {
      const formData = new FormData();
      formData.append("document-file", data.file);
      formData.append("documenttype", data.documentType);
      await settingsApi.submitKyc(formData);
      
      // Update local state to pending
      setKycStatus((prev) => ({
        ...prev,
        status: "pending",
        tier: "Pending Review",
      }));
      
      toast.success("KYC documentation submitted successfully!");
    } catch (err) {
      toast.error("Failed to upload KYC credentials.");
      throw err;
    } finally {
      setIsSyncing(false);
    }
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
                <span>{kycStatus.status === "verified" ? "Verified Broker" : kycStatus.status === "pending" ? "Verification Pending" : "Unverified Broker"}</span>
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
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{kycStatus.tier}</span>
              </div>

              {/* Dispersal limits */}
              <div className="flex justify-between items-center text-xs mb-3">
                <span className="text-gray-500 dark:text-gray-400">Monthly dispersal Limit:</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  ₦{kycStatus.dispersalLimitUsed.toLocaleString()} / <span className="text-gray-400 dark:text-zinc-600">₦{kycStatus.dispersalLimitTotal.toLocaleString()}</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#FAFBFA] dark:bg-zinc-900 border border-[#E4E3E3CC] dark:border-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-[#0F3D2E] dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (kycStatus.dispersalLimitUsed / kycStatus.dispersalLimitTotal) * 100)}%` }}
                ></div>
              </div>

              {/* Verified Upgrade Banner Info */}
              <div className="flex items-start gap-2 text-[11px] leading-relaxed text-[#2E7D32] dark:text-emerald-400">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <span>
                  {kycStatus.status === "verified"
                    ? "Limits raised to ₦50,000,000 monthly. Your premium compliance badge is active."
                    : kycStatus.status === "pending"
                    ? "Your credentials have been submitted and are under review. Limits will be raised shortly."
                    : "Upload identity credentials to raise your limits."}
                </span>
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
              initialData={notificationData}
              onCancel={() => setActiveView("main")}
              onSave={handleSaveNotifications}
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
              onSave={handleSaveKyc}
            />
          )}

          {activeView === "preferences" && (
            <PreferencesForm
              initialData={preferencesData}
              onCancel={() => setActiveView("main")}
              onSave={handleSavePreferences}
            />
          )}
        </div>
      )}
    </div>
  );
}
