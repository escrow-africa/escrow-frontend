"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface PreferencesFormProps {
  initialData: {
    currency?: string;
    language?: string;
    timezone?: string;
  } | null;
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function PreferencesForm({
  initialData,
  onCancel,
  onSave,
}: PreferencesFormProps) {
  const [currency, setCurrency] = useState(initialData?.currency || "NGN");
  const [language, setLanguage] = useState(initialData?.language || "en-US");
  const [timezone, setTimezone] = useState(initialData?.timezone || "GMT+1");
  const [saving, setSaving] = useState(false);

  // Sync initialData changes
  React.useEffect(() => {
    if (initialData) {
      setCurrency(initialData.currency || "NGN");
      setLanguage(initialData.language || "en-US");
      setTimezone(initialData.timezone || "GMT+1");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ currency, language, timezone });
      toast.success("Preferences updated successfully!");
    } catch {
      // Handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in text-gray-900 dark:text-gray-200 px-4 pt-8 pb-16">
      {/* Back Link */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0F3D2E] dark:hover:text-[#F3B659] mb-6 transition-colors font-semibold text-sm focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-md p-6 md:p-8 shadow-xs">
        {/* Header */}
        <div className="pb-6 border-b border-gray-100 dark:border-zinc-850 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferences & Localization</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure default currency, interface language, and localized timezone preferences.
            </p>
          </div>
          
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Default Currency */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 tracking-[0.15em] mb-2 uppercase">
              Preferred Payout & Ad Currency
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border !border-transparent bg-[#FAFBFA] dark:bg-zinc-900/50 border-[#E4E3E3CC] dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-emerald-500 font-semibold text-sm appearance-none cursor-pointer pr-10"
                required
              >
                <option value="NGN">NGN (₦) - Nigerian Naira</option>
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
            <span className="block text-[11px] text-gray-400 dark:text-gray-500 mt-2">
              All escrow listings and wallet balances will be displayed using this base currency.
            </span>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.15em] mb-2 uppercase">
              Timezone (Escrow Co-Signs)
            </label>
            <div className="relative">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border !border-transparent bg-[#FAFBFA] dark:bg-zinc-900/50 border-[#E4E3E3CC] dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-emerald-500 font-semibold text-sm appearance-none cursor-pointer pr-10"
                required
              >
                <option value="GMT+1">GMT+1 - Lagos, London, West Africa</option>
                <option value="GMT+0">GMT+0 - London, Dublin, Lisbon</option>
                <option value="GMT+2">GMT+2 - Cairo, Johannesburg</option>
                <option value="GMT-5">GMT-5 - New York, Washington</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
            <span className="block text-[11px] text-gray-400 dark:text-gray-500 mt-2">
              Determines countdown expiration timing for buyer inspection and milestone auto-releases.
            </span>
          </div>

          {/* Interface Language */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.15em] mb-2 uppercase">
              Default Interface Language
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border !border-transparent bg-[#FAFBFA] dark:bg-zinc-900/50 border-[#E4E3E3CC] dark:border-zinc-800 text-gray-955 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-emerald-500 font-semibold text-sm appearance-none cursor-pointer pr-10"
                required
              >
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="fr-FR">Français (French)</option>
                <option value="es-ES">Español (Spanish)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100 dark:border-zinc-850 max-w-md mx-auto w-full">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 py-3 bg-white dark:bg-zinc-900 text-gray-705 dark:text-gray-300 border border-[#E4E3E3CC] dark:border-zinc-800 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-center disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-[#0F3D2E] dark:bg-[#185541] text-white rounded-xl text-xs font-bold hover:bg-[#185541] dark:hover:bg-[#236b53] transition-colors cursor-pointer text-center flex items-center justify-center disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
