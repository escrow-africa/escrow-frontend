"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ArrowRight } from "lucide-react";

interface TopUpBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  defaultAmount?: number;
  maxAmount?: number;
  isLoading?: boolean;
}

export default function TopUpBudgetModal({
  isOpen,
  onClose,
  onConfirm,
  defaultAmount = 500000,
  maxAmount,
  isLoading = false,
}: TopUpBudgetModalProps) {
  const [amount, setAmount] = useState(defaultAmount);

  useEffect(() => {
    setAmount(defaultAmount);
  }, [defaultAmount]);

  const formattedAmount = useMemo(() => {
    return amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }, [amount]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isLoading) return;
    const nextAmount = Math.max(0, Math.round(amount));
    if (maxAmount !== undefined) {
      onConfirm(Math.min(nextAmount, maxAmount));
      return;
    }
    onConfirm(nextAmount);
  };

  const handleInputChange = (value: string) => {
    const numeric = Number(value.replace(/[^0-9]/g, ""));
    setAmount(Number.isFinite(numeric) ? numeric : 0);
  };

  const quickOptions = [50000, 100000, 250000, 500000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">Fund Campaign Budget</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Specify the budget amount to load into this campaign</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            aria-label="Close top-up modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 mb-6">
          <label htmlFor="topup-amount" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 mb-2 block">
            Fuel amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₦</span>
            <input
              id="topup-amount"
              type="text"
              value={formattedAmount}
              onChange={(event) => handleInputChange(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-10 pr-4 text-2xl font-semibold text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              inputMode="numeric"
            />
          </div>
          {maxAmount !== undefined && (
            <p className="mt-3 text-xs text-slate-500">
              Maximum allowed top-up amount is ₦{maxAmount.toLocaleString()}.
            </p>
          )}
        </div>

        <div className="grid gap-3 mb-6 sm:grid-cols-2">
          {quickOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAmount(option)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              ₦{option.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-3xl bg-[#0F3D2E] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#123828] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isLoading ? "Processing..." : "Deposit"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
