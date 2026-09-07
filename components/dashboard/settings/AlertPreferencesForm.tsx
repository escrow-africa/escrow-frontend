"use client";

import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import toast from "react-hot-toast";

interface AlertPreferencesFormProps {
  initialData: {
    escrowContractReleases: boolean;
    dispersalClearingAlerts: boolean;
    disputeArbitrationWarning: boolean;
    tipsPromotionalAnalytics: boolean;
  } | null;
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

export default function AlertPreferencesForm({
  initialData,
  onCancel,
  onSave,
}: AlertPreferencesFormProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);

  const [saving, setSaving] = useState(false);

  // Sync initialData changes
  React.useEffect(() => {
    if (initialData) {
      setPreferences([
        { id: "escrowContractReleases", title: "Escrow Contract Releases", description: "Dispatch instant notification when buyer funds are locked or cleared.", checked: initialData.escrowContractReleases },
        { id: "dispersalClearingAlerts", title: "Dispersal Clearing Alerts", description: "Alert when a banking payout leaves the secure EscrowAfrica ledger.", checked: initialData.dispersalClearingAlerts },
        { id: "disputeArbitrationWarning", title: "Dispute & Arbitration Warning", description: "High priority warnings if a buyer requests mediator mediation.", checked: initialData.disputeArbitrationWarning },
        { id: "tipsPromotionalAnalytics", title: "Tips and Promotional Analytics", description: "Monthly ad performance spikes, tips and general newsletters.", checked: initialData.tipsPromotionalAnalytics },
      ]);
    }
  }, [initialData]);

  const handleToggle = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, checked: !pref.checked } : pref
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Map preferences array to key-value object for API compatibility
      const data = preferences.reduce((acc, current) => {
        acc[current.id] = current.checked;
        return acc;
      }, {} as Record<string, boolean>);

      await onSave(data);
      toast.success("Notification preferences saved successfully!");
    } catch (err) {
      toast.error("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
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

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xs">
        {/* Header */}
        <div className="pb-6 mb-8 border-b border-gray-100 dark:border-zinc-800/80">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compliance Notifications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Decide what system notifications are dispatched and where.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* List of Notification Options */}
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                onClick={() => handleToggle(pref.id)}
                className="border border-[#E4E3E3CC] dark:border-zinc-800 bg-[#FAFBFA] dark:bg-zinc-900/30 rounded-xl p-5 flex items-center justify-between gap-6 cursor-pointer select-none hover:shadow-xs hover:border-gray-300 dark:hover:border-zinc-700 transition-all group"
              >
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base group-hover:text-[#0F3D2E] dark:group-hover:text-[#F3B659] transition-colors">
                    {pref.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {pref.description}
                  </p>
                </div>

                {/* Custom Styled Checkbox */}
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200 ${
                    pref.checked
                      ? "bg-[#2563EB] border-[#2563EB] dark:bg-blue-600 dark:border-blue-600 text-white"
                      : "border-[#E4E3E3CC] bg-white dark:bg-zinc-800"
                  }`}
                >
                  {pref.checked && <Check size={14} className="stroke-[3.5]" />}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="w-full sm:w-auto px-10 py-3 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-10 py-3 bg-[#0F3D2E] dark:bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-[#185541] dark:hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
