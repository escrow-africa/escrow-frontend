"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, Laptop, Smartphone, MapPin, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface SecurityFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
  billingAddress?: string;
}

interface BrowserSession {
  id: number;
  browser: string;
  location: string;
  ip: string;
  isActive: boolean;
  type: "desktop" | "mobile";
}

export default function SecurityForm({
  onCancel,
  onSave,
  billingAddress = "22 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
}: SecurityFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [address, setAddress] = useState(billingAddress);

  // Active sessions state for mock interactivity
  const [sessions, setSessions] = useState<BrowserSession[]>([
    {
      id: 1,
      browser: "Chrome on macOS (Mac Studio)",
      location: "Ikeja, Lagos",
      ip: "197.210.64.43",
      isActive: true,
      type: "desktop",
    },
    {
      id: 2,
      browser: "Safari on iPhone 15 Pro",
      location: "Lekki, Lagos",
      ip: "102.89.43.11",
      isActive: false,
      type: "mobile",
    },
    {
      id: 3,
      browser: "Edge on Windows 11 Desktop",
      location: "Abuja, FCT",
      ip: "197.210.88.92",
      isActive: false,
      type: "desktop",
    },
  ]);

  // Modal State
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateInput, setDeactivateInput] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: any) => {
    try {
      await onSave({ ...data, billingAddress: address });
      reset();
      toast.success("Security settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update password.");
    }
  };

  const handleRevokeOthers = () => {
    setSessions((prev) => prev.filter((s) => s.isActive));
    toast.success("Other active browser sessions have been revoked.");
  };

  const handleDeactivate = async () => {
    if (deactivateInput !== "DEACTIVATE") return;
    setIsDeactivating(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDeactivating(false);
    setShowDeactivateModal(false);
    toast.success("Broker profile deactivated successfully.");
    onCancel(); // Navigate back
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0F3D2E] dark:hover:text-[#F3B659] mb-6 transition-colors font-medium text-sm focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Main Column Stack */}
      <div className="space-y-6">
        {/* 1. Change Password Form Card */}
        <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ensure your password remains complex and synchronized.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Account Password */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                Current Acount Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all pr-12"
                  {...register("currentPassword", { required: "Current password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all pr-12"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all pr-12"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === newPassword || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Physical Billing Address */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                Physical Billing Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter billing address"
                className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
              />
            </div>

            {/* Change Password Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-3 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-3 bg-[#0F3D2E] dark:bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-[#185541] dark:hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Active Browser Sessions Card */}
        <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Browser Sessions</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Logged in browser sessions currently linked to your escrow profile.
              </p>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleRevokeOthers}
                className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer focus:outline-none"
              >
                Revoke Others
              </button>
            )}
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border border-[#E4E3E3CC] dark:border-zinc-800 bg-[#FAFBFA] dark:bg-zinc-900/30 rounded-xl p-4 flex items-center gap-4 transition-all"
              >
                {/* Device Icon */}
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 shadow-2xs">
                  {session.type === "desktop" ? <Laptop size={20} /> : <Smartphone size={20} />}
                </div>

                {/* Session Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm md:text-base truncate">
                      {session.browser}
                    </h4>
                    {session.isActive && (
                      <span className="bg-[#E8F5E9] dark:bg-emerald-950/50 text-[#2E7D32] dark:text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-md font-extrabold tracking-wider uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-1">
                    <MapPin size={12} className="shrink-0" />
                    <span>
                      {session.location} &bull; {session.ip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Danger Zone Card */}
        <div className="bg-[#FFF5F5] dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex gap-4 items-start mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-800 dark:text-red-400">DANGER ZONE</h2>
              <p className="text-sm text-red-600/80 dark:text-red-300/60 mt-1">
                Irreversible structural changes to your professional broker account.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-red-100 dark:border-red-950/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                Deactivate and Terminate Ledger Connection
              </h3>
              <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-1 max-w-lg">
                This will release any active ad campaigns, revoke pending payouts, and deactivate your verified broker status.
              </p>
            </div>
            <button
              onClick={() => {
                setDeactivateInput("");
                setShowDeactivateModal(true);
              }}
              className="px-6 py-3 bg-[#E11D48] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 uppercase tracking-wider animate-pulse hover:animate-none"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Modal Overlay */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center relative animate-scale-in">
            {/* Warning Circle Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-5">
              <AlertTriangle size={28} />
            </div>

            {/* Modal Titles */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Deactivate Broker Profile?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              This action cannot be undone. You will lose access to active ad pipelines, transaction histories, and trading credibility records.
            </p>

            {/* Prompt */}
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-3">
              To confirm deactivation, please type <span className="text-red-500 font-bold">DEACTIVATE</span> in the field below:
            </p>

            {/* Input Box */}
            <input
              type="text"
              placeholder="DEACTIVATE"
              value={deactivateInput}
              onChange={(e) => setDeactivateInput(e.target.value)}
              className="w-full text-center px-4 py-3.5 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold placeholder-red-300 dark:placeholder-red-900/50 transition-all mb-6 uppercase"
            />

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                disabled={isDeactivating}
                className="px-5 py-3 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={deactivateInput !== "DEACTIVATE" || isDeactivating}
                className="px-5 py-3 bg-[#E11D48] hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeactivating ? "Deactivating..." : "Confirm Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
