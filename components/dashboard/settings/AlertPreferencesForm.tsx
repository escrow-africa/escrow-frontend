"use client";

import React, { useState } from "react";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

interface AlertPreferencesFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function AlertPreferencesForm({
  onCancel,
  onSave,
}: AlertPreferencesFormProps) {
  const [preferences, setPreferences] = useState({
    escrowCreatedEmail: true,
    escrowCreatedPush: true,
    escrowCreatedSMS: false,
    paymentReleasedEmail: true,
    paymentReleasedPush: true,
    paymentReleasedSMS: true,
    disputeRaisedEmail: true,
    disputeRaisedPush: true,
    disputeRaisedSMS: true,
    securityAlertsEmail: true,
    securityAlertsPush: true,
    securityAlertsSMS: true,
  });

  const [saving, setSaving] = useState(false);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(preferences);
      toast.success("Notification preferences saved!");
    } catch (err) {
      // handled by parent
    } finally {
      setSaving(false);
    }
  };

  const notificationSections = [
    {
      title: "Escrow Transactions",
      description: "When an escrow transaction is created, funded, or progress updates occur.",
      keys: {
        email: "escrowCreatedEmail" as const,
        push: "escrowCreatedPush" as const,
        sms: "escrowCreatedSMS" as const,
      },
    },
    {
      title: "Payment Release & Completed Escrows",
      description: "When funds are released or payouts are completed successfully.",
      keys: {
        email: "paymentReleasedEmail" as const,
        push: "paymentReleasedPush" as const,
        sms: "paymentReleasedSMS" as const,
      },
    },
    {
      title: "Disputes & Support",
      description: "When a dispute is raised, escalated, or support messages are received.",
      keys: {
        email: "disputeRaisedEmail" as const,
        push: "disputeRaisedPush" as const,
        sms: "disputeRaisedSMS" as const,
      },
    },
    {
      title: "Security & Account Alerts",
      description: "Critical security notifications, password changes, and login attempts.",
      keys: {
        email: "securityAlertsEmail" as const,
        push: "securityAlertsPush" as const,
        sms: "securityAlertsSMS" as const,
      },
    },
  ];

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
        <div className="pb-6 border-b border-gray-100 dark:border-zinc-800 mb-8">
          <h2 className="text-xl font-bold text-primary dark:text-[#F3B659]">Alert Preferences</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Choose how and when you want to be notified about transaction milestones and account security.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Notification Matrix */}
          <div className="space-y-6">
            {notificationSections.map((sec, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row justify-between md:items-center pb-6 border-b border-gray-100 dark:border-zinc-800/80 gap-4 last:border-b-0 last:pb-0"
              >
                <div className="max-w-md">
                  <h3 className="font-semibold text-primary dark:text-white text-base">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {sec.description}
                  </p>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                  {/* Email Toggle */}
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 px-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-800 select-none">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2">Email</span>
                    <button
                      type="button"
                      onClick={() => handleToggle(sec.keys.email)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences[sec.keys.email] ? "bg-[#0F3D2E]" : "bg-gray-200 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences[sec.keys.email] ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Push Toggle */}
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 px-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-800 select-none">
                    <Bell size={16} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2">Push</span>
                    <button
                      type="button"
                      onClick={() => handleToggle(sec.keys.push)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences[sec.keys.push] ? "bg-[#0F3D2E]" : "bg-gray-200 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences[sec.keys.push] ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* SMS Toggle */}
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 px-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-800 select-none">
                    <Smartphone size={16} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2">SMS</span>
                    <button
                      type="button"
                      onClick={() => handleToggle(sec.keys.sms)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences[sec.keys.sms] ? "bg-[#0F3D2E]" : "bg-gray-200 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences[sec.keys.sms] ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0F3D2E] dark:bg-[#185541] text-white rounded-lg text-sm font-semibold hover:bg-[#185541] dark:hover:bg-[#236b53] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
