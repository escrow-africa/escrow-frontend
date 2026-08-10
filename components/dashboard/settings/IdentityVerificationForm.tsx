"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Shield, Paperclip, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface IdentityVerificationFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

type StepType = 1 | 2 | 3;

export default function IdentityVerificationForm({
  onCancel,
  onSave,
}: IdentityVerificationFormProps) {
  const [step, setStep] = useState<StepType>(1);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectDocType = (type: string) => {
    setSelectedDocType(type);
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      toast.success(`Document selected: ${selectedFile.name}`);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(droppedFile);
      toast.success(`File selected: ${droppedFile.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload your identity scan first.");
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        documentType: selectedDocType,
        fileName: file.name,
        fileSize: file.size,
      });
      setStep(3);
    } catch (err) {
      toast.error("Failed to submit verification documents.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in pb-12 font-sans text-gray-900 dark:text-gray-200">
      {/* Back to Settings Link */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0F3D2E] dark:hover:text-[#F3B659] mb-6 transition-colors font-semibold text-sm focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-[32px] p-8 md:p-10 shadow-xs flex flex-col items-center">
        {step === 1 && (
          <div className="w-full flex flex-col items-center">
            {/* Shield Icon Badge */}
            <div className="w-14 h-14 bg-[#E5ECE9] dark:bg-emerald-950/20 rounded-full flex items-center justify-center text-[#0F3D2E] dark:text-[#F3B659] mb-6 shadow-inner">
              <Shield size={26} className="stroke-[1.5]" />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Identity Verification (KYC)
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center max-w-lg leading-relaxed mb-8">
              Verify your identification to comply with federal digital asset guidelines, raise withdrawal limits, and receive the "Verified Broker" credibility badge.
            </p>

            {/* Document List Selector */}
            <div className="w-full text-left">
              <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.15em] mb-4 uppercase">
                Select Document Type To Upload
              </span>

              <div className="space-y-3 w-full">
                {["International Passport", "Driver’s License", "National ID Card"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSelectDocType(type)}
                    className="w-full flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl hover:border-[#0F3D2E] dark:hover:border-emerald-500 cursor-pointer transition-all duration-200 group text-left shadow-2xs hover:shadow-xs"
                  >
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#0F3D2E] dark:group-hover:text-[#F3B659]">
                      {type}
                    </span>
                    <ChevronRight
                      size={18}
                      className="text-gray-400 group-hover:text-[#0F3D2E] dark:group-hover:text-[#F3B659] transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full flex flex-col items-center">
            {/* Title & Subtitle */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Upload Identity File
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-8">
              Provide a clear scan of your official document. Details must remain legible.
            </p>

            {/* Drag & Drop Zone */}
            <form onSubmit={handleSubmit} className="w-full">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer relative transition-all duration-200 min-h-[220px] flex flex-col items-center justify-center bg-[#FAFBFA] dark:bg-zinc-900/30 ${
                  dragActive
                    ? "border-[#0F3D2E] dark:border-emerald-500 bg-[#FAFBFA]/80"
                    : "border-[#E4E3E3CC] dark:border-zinc-800 hover:border-[#0F3D2E] dark:hover:border-emerald-500"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center justify-center">
                    <CheckCircle2 className="text-[#0F3D2E] dark:text-emerald-500 mb-2" size={32} />
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[280px] px-4">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; Click to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center group">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-gray-150 dark:border-zinc-700 flex items-center justify-center text-gray-500 group-hover:text-[#0F3D2E] dark:group-hover:text-emerald-500 transition-colors mb-3 shadow-2xs">
                      <Paperclip size={18} />
                    </div>
                    <p className="text-xs font-bold text-gray-850 dark:text-gray-200 mb-1">
                      Click to upload or drag identity scan
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Supports JPEG, PNG, or PDF format (Max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex w-full gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setStep(1);
                  }}
                  disabled={submitting}
                  className="flex-1 py-3 px-5 border border-[#E4E3E3CC] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-center disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || !file}
                  className="flex-1 py-3 px-5 bg-[#0F3D2E] dark:bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-[#185541] dark:hover:bg-emerald-600 transition-colors cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit For Review</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="w-full flex flex-col items-center">
            {/* Success Icon Badge */}
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-full flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-6 shadow-inner">
              <CheckCircle2 size={28} className="stroke-[2.5]" />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              KYC Verification Submitted!
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center max-w-md leading-relaxed mb-8">
              Your credentials have been uploaded to our automated KYC audit ledger. We will notify you via compliance email inside 4 hours once limits are upgraded.
            </p>

            {/* Action button */}
            <button
              onClick={onCancel}
              className="w-full py-3.5 bg-[#0F3D2E] dark:bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-[#185541] dark:hover:bg-emerald-600 transition-colors cursor-pointer text-center"
            >
              Back to Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
