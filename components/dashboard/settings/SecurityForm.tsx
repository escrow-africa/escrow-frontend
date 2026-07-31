"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface SecurityFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function SecurityForm({ onCancel, onSave }: SecurityFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

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
      await onSave({ ...data, twoFactorEnabled });
      reset();
      toast.success("Security settings updated successfully!");
    } catch (err) {
      // handled by parent
    }
  };

  const handle2FAToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(
      `Two-Factor Authentication (2FA) has been ${!twoFactorEnabled ? "enabled" : "disabled"}.`
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium text-sm focus:outline-none"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      <div className="bg-white dark:bg-[#18181b] border border-border dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {/* Header */}
        <div className="pb-6 border-b border-gray-100 dark:border-zinc-800 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-primary dark:text-[#F3B659]">Security Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your password, security keys, and two-factor authentication.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold self-start border border-emerald-100 dark:border-emerald-900/50">
            <Shield size={14} />
            <span>Secure Connection</span>
          </div>
        </div>

        {/* 2FA Toggle Card */}
        <div className="bg-[#FAFBFA] dark:bg-zinc-900/50 border border-border dark:border-zinc-800 rounded-xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-primary dark:text-white text-base">Two-Factor Authentication (2FA)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              Add an extra layer of security to your account by requesting a verification code upon login.
            </p>
          </div>
          <button
            type="button"
            onClick={handle2FAToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              twoFactorEnabled ? "bg-[#0F3D2E]" : "bg-gray-200 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                twoFactorEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="font-bold text-primary dark:text-white text-base">Change Password</h3>

          {/* Current Password */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all pr-12 ${
                  errors.currentPassword ? "border-red-500" : ""
                }`}
                {...register("currentPassword", { required: "Current password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1.5 text-xs text-red-500">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* New Password */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all pr-12 ${
                    errors.newPassword ? "border-red-500" : ""
                  }`}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all pr-12 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === newPassword || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0F3D2E] dark:bg-[#185541] text-white rounded-lg text-sm font-semibold hover:bg-[#185541] dark:hover:bg-[#236b53] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
