"use client";

import React, { useState } from "react";
import { ArrowLeft, ShieldAlert, Upload, CheckCircle2, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface IdentityVerificationFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function IdentityVerificationForm({
  onCancel,
  onSave,
}: IdentityVerificationFormProps) {
  const [kycLevel, setKycLevel] = useState("Tier 2 Verified");
  const [submitting, setSubmitting] = useState(false);
  const [idFile, setIdFile] = useState<string | null>(null);
  const [utilityFile, setUtilityFile] = useState<string | null>(null);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFile(file.name);
      toast.success(`Government ID "${file.name}" selected.`);
    }
  };

  const handleUtilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUtilityFile(file.name);
      toast.success(`Proof of Address "${file.name}" selected.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFile && !utilityFile) {
      toast.error("Please upload at least one document to request tier upgrade.");
      return;
    }
    setSubmitting(true);
    try {
      await onSave({ idFile, utilityFile });
      toast.success("Documents submitted successfully! Review takes 24-48 hours.");
      setIdFile(null);
      setUtilityFile(null);
    } catch (err) {
      // Handled by parent
    } finally {
      setSubmitting(false);
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
            <h2 className="text-xl font-bold text-primary dark:text-[#F3B659]">Identity Verification (KYC)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Verify your identity to increase transaction limits, enable premium features, and ensure broker status.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-[#185541]/30 text-[#0F3D2E] dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold self-start border border-[#0F3D2E]/20">
            <CheckCircle2 size={14} />
            <span>{kycLevel}</span>
          </div>
        </div>

        {/* Current status info */}
        <div className="bg-gray-50 dark:bg-zinc-900/50 border border-border dark:border-zinc-800 rounded-xl p-5 mb-8">
          <h3 className="font-semibold text-primary dark:text-white text-sm mb-3">Verification Tier Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-r border-gray-100 dark:border-zinc-800 last:border-r-0 pr-4">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Current Limit</span>
              <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">₦5,000,000 / month</p>
            </div>
            <div className="border-r border-gray-100 dark:border-zinc-800 last:border-r-0 pr-4">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Features Enabled</span>
              <p className="text-sm font-semibold text-emerald-600 mt-1">Direct Escrows, Broker Tags</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Next Tier Requirement</span>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Corporate Tax Certificate & Tax ID (TIN)</p>
            </div>
          </div>
        </div>

        {/* Upload forms */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="font-bold text-primary dark:text-white text-base">Request Upgrade (Tier 3)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Government Issued ID */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-3 uppercase">
                Government Issued ID
              </label>
              <div className="relative border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-primary dark:hover:border-[#F3B659] rounded-xl p-6 text-center transition-colors cursor-pointer group">
                <input
                  type="file"
                  onChange={handleIdChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {idFile ? (
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="text-primary dark:text-[#F3B659] mb-2" size={32} />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-full px-4">
                      {idFile}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1">Click to replace file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="text-gray-400 group-hover:text-primary dark:group-hover:text-[#F3B659] mb-2 transition-colors" size={24} />
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      Upload ID Document
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      National ID Card, International Passport, or Driver's License
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Proof of Address */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-3 uppercase">
                Proof of Address
              </label>
              <div className="relative border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-primary dark:hover:border-[#F3B659] rounded-xl p-6 text-center transition-colors cursor-pointer group">
                <input
                  type="file"
                  onChange={handleUtilityChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {utilityFile ? (
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="text-primary dark:text-[#F3B659] mb-2" size={32} />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-full px-4">
                      {utilityFile}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1">Click to replace file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="text-gray-400 group-hover:text-primary dark:group-hover:text-[#F3B659] mb-2 transition-colors" size={24} />
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      Upload Utility Bill
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Utility Bill, Bank Statement, or Rent Agreement (Max 3 months old)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0F3D2E] dark:bg-[#185541] text-white rounded-lg text-sm font-semibold hover:bg-[#185541] dark:hover:bg-[#236b53] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Documents"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
