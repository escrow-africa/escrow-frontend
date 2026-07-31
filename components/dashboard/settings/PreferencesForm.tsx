"use client";

import React, { useState } from "react";
import { ArrowLeft, Globe } from "lucide-react";
import toast from "react-hot-toast";

interface PreferencesFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function PreferencesForm({
  onCancel,
  onSave,
}: PreferencesFormProps) {
  const [currency, setCurrency] = useState("NGN");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ currency, language, timezone });
      toast.success("Preferences updated successfully!");
    } catch (err) {
      // Handled by parent
    } finally {
      setSaving(false);
    }
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
            <h2 className="text-xl font-bold text-primary dark:text-[#F3B659]">Preferences & Localization</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure your regional parameters, display language, and default escrow settlement currencies.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 px-3.5 py-1.5 rounded-full text-xs font-semibold self-start border border-border">
            <Globe size={14} />
            <span>UTC+01:00</span>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Default Currency */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              Default Escrow Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
              required
            >
              <option value="NGN">Nigerian Naira (₦ / NGN)</option>
              <option value="USD">United States Dollar ($ / USD)</option>
              <option value="EUR">Euro (€ / EUR)</option>
              <option value="GBP">British Pound (£ / GBP)</option>
              <option value="GHS">Ghanaian Cedi (₵ / GHS)</option>
              <option value="KES">Kenyan Shilling (KSh / KES)</option>
            </select>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
              All newly initiated escrows will default to this currency denomination.
            </p>
          </div>

          {/* Language selection */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              Interface Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
              required
            >
              <option value="English">English</option>
              <option value="French">Français (French)</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="Arabic">العربية (Arabic)</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
              required
            >
              <option value="Africa/Lagos">Africa/Lagos (GMT+01:00)</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+02:00)</option>
              <option value="Africa/Nairobi">Africa/Nairobi (GMT+03:00)</option>
              <option value="Europe/London">Europe/London (GMT+00:00)</option>
              <option value="America/New_York">America/New_York (GMT-05:00)</option>
            </select>
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
