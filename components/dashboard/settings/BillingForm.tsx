"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

interface BillingFormProps {
  initialData: {
    companyName?: string;
    vatId?: string;
    billingAddress?: string;
  } | null;
  onCancel: () => void;
  onSave: (data: {
    companyName: string;
    vatId: string;
    billingAddress: string;
  }) => Promise<void>;
}

interface FormValues {
  companyName: string;
  vatId: string;
  billingAddress: string;
}

export default function BillingForm({
  initialData,
  onCancel,
  onSave,
}: BillingFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      companyName: initialData?.companyName || "",
      vatId: initialData?.vatId || "",
      billingAddress: initialData?.billingAddress || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("companyName", initialData.companyName || "");
      setValue("vatId", initialData.vatId || "");
      setValue("billingAddress", initialData.billingAddress || "");
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      await onSave(data);
    } catch (err) {
      // Handled by parent
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-16">
      {/* Back to Settings Link */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium text-sm focus:outline-none"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-[#18181b] border border-border dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {/* Header */}
        <div className="pb-6 border-b border-gray-100 dark:border-zinc-800 mb-8">
          <h2 className="text-xl font-bold text-primary dark:text-[#F3B659]">
            Billing & Corporate Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Setup invoicing credentials, company address details, and VAT identifiers.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Registered Company Name */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              Registered Company Name
            </label>
            <input
              type="text"
              placeholder="Company Name"
              className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all ${
                errors.companyName ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("companyName", { required: "Company name is required" })}
            />
            {errors.companyName && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* VAT ID / Company Tax Registration Number */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              VAT ID / Company Tax Registration Number
            </label>
            <input
              type="text"
              placeholder="VAT ID / Tax Reg Number"
              className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all ${
                errors.vatId ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("vatId", { required: "VAT ID / Tax Registration Number is required" })}
            />
            {errors.vatId && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.vatId.message}
              </p>
            )}
          </div>

          {/* Physical Billing Address */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              Physical Billing Address
            </label>
            <input
              type="text"
              placeholder="Physical Billing Address"
              className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all ${
                errors.billingAddress ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("billingAddress", { required: "Billing address is required" })}
            />
            {errors.billingAddress && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.billingAddress.message}
              </p>
            )}
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
              {isSubmitting ? "Saving..." : "Save Corporate Invoicing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
