"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { escrowApi } from "../../../api/escrow";
import { Calendar, ChevronRight, Copy, FileMinus, Lock, Search, ShieldCheck } from "lucide-react";

const inspectionOptions = ["1 Day Review", "3 Days Review", "5 Days Review", "7 Days Review"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CreateEscrowPage() {
  const [buyer, setBuyer] = useState("");
  const [amount, setAmount] = useState("");
  const [milestones, setMilestones] = useState(["", ""]);
  const [deadline, setDeadline] = useState("");
  const [inspectionPeriod, setInspectionPeriod] = useState(inspectionOptions[0]);
  const [details, setDetails] = useState("");
  const [step, setStep] = useState<"form" | "submitting" | "success">("form");

  const today = new Date().toISOString().split('T')[0];

  const parsedAmount = useMemo(() => {
    const numeric = Number(amount.replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
  }, [amount]);

  const payoutAmount = useMemo(() => {
    const fee = Math.round(parsedAmount * 0.015 * 100) / 100;
    return Math.max(0, parsedAmount - fee);
  }, [parsedAmount]);

  const canInitialize = Boolean(buyer.trim() && parsedAmount > 0 && milestones.some((m) => m.trim()) && deadline);

  const router = useRouter();

  const handleInitialize = async () => {
    if (!canInitialize) return;
    setStep("submitting");

    // Build payload matching backend CreateEscrowDto
    const payload = {
      buyerEmail: buyer.trim(),
      milestones: milestones.filter((m) => m.trim()).map((m) => m.trim()),
      amount: parsedAmount,
      deliveryDeadline: deadline,
      inspectionPeriodDays: Number(inspectionPeriod.match(/\d+/)?.[0] || 0),
      description: details || undefined,
    };

    try {
      await escrowApi.create(payload);
      toast.success("Escrow initialized");
      router.push("/dashboard/escrows");
    } catch (error: any) {
      console.error("create escrow failed", error);
      const message = error?.response?.data?.message || "Failed to initialize escrow";
      toast.error(message);
      setStep("form");
    }
  };

  const updateMilestone = (index: number, value: string) => {
    setMilestones((current) => current.map((item, idx) => (idx === index ? value : item)));
  };

  const addMilestone = () => {
    setMilestones((current) => [...current, ""]);
  };

  const summaryBase = formatCurrency(parsedAmount);
  const summaryFee = formatCurrency(Math.round(parsedAmount * 0.015 * 100) / 100);
  const summaryPayout = formatCurrency(payoutAmount);

  return (
    <div className="flex flex-col h-full fade-in pb-12 max-w-7xl mx-auto">
      {step !== "success" ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-8">
          <div className="bg-white rounded-[30px] p-8 shadow-[0_20px_60px_rgba(15,61,46,0.08)] border border-gray-100">
            <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Transaction Details</h1>
            <p className="text-gray-500 text-sm mb-8">Define the scope and scale of your escrow agreement</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Buyer Identity</span>
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                    placeholder="Email or @username"
                    className="w-full pl-11 pr-4 py-3 bg-[#F5F7F8] border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/15"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Escrow Amount</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₦ 0.00"
                  className="w-full pr-4 py-3 bg-[#F5F7F8] border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/15"
                />
              </label>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Project Milestones</span>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="text-sm font-semibold text-[#0F3D2E] hover:text-[#185541]"
                >
                  + Add Milestone
                </button>
              </div>
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-[#F5F7F8] border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-sm font-bold flex items-center justify-center text-gray-600">{index + 1}</div>
                    <input
                      type="text"
                      value={milestone}
                      onChange={(e) => updateMilestone(index, e.target.value)}
                      placeholder={`Milestone ${index + 1}`}
                      className="flex-1 bg-transparent focus:outline-none text-sm text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => updateMilestone(index, "")}
                      className="text-red-500 hover:text-red-600"
                      aria-label="Remove milestone"
                    >
                      <FileMinus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Delivery Deadline</span>
                <div className="relative">
                  <Calendar size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={today}
                    className="w-full pl-11 pr-4 py-3 bg-[#F5F7F8] border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/15"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Inspection Period</span>
                <select
                  value={inspectionPeriod}
                  onChange={(e) => setInspectionPeriod(e.target.value)}
                  className="w-full py-3 pl-4 pr-10 bg-[#F5F7F8] border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/15"
                >
                  {inspectionOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Detailed Terms (Optional)</span>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
                placeholder="List specific conditions, scope limitations, or refund policies,..."
                className="w-full p-4 bg-[#F5F7F8] border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/15"
              />
            </label>
          </div>

          <div className="bg-[#081B26] rounded-[30px] p-8 text-white shadow-[0_20px_60px_rgba(15,61,46,0.18)] border border-[#13343F] max-h-[calc(100vh-120px)]">
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Escrow Summary</p>
                  <p className="mt-2 text-sm text-[#CBD5E1]">Review your secure terms</p>
                </div>
                <div className="rounded-3xl bg-[#0F3D2E] p-3">
                  <ShieldCheck size={20} className="text-[#34D399]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-[#94A3B8]">
                <div className="bg-[#0F2932] rounded-3xl p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Base Deposit</p>
                  <p className="mt-2 font-semibold text-white">{summaryBase}</p>
                </div>
                <div className="bg-[#0F2932] rounded-3xl p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Platform Fee (1.5%)</p>
                  <p className="mt-2 font-semibold text-red-400">-{summaryFee}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#112B39] p-6 mb-6 border border-[#194158]">
              <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Estimated Payout</p>
              <p className="mt-2 text-3xl font-bold text-[#F5C524]">{summaryPayout}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-[#94A3B8]">
                <span>Timeline</span>
                <span>3 Day Window</span>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#194158] bg-[#0F2932] p-5 mb-8">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-[#0F3D2E] flex items-center justify-center text-[#34D399]">
                  <Lock size={18} />
                </div>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  Funds are held as collateral in a multi-sig vault. You retain ownership of intellectual property until full release.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleInitialize}
              disabled={!canInitialize || step === "submitting"}
              className={`w-full py-4 rounded-2xl text-sm font-semibold transition-colors ${canInitialize ? "bg-[#F5C524] text-[#081B26] hover:bg-[#ffce3f]" : "bg-[#2d4350] text-[#718096] cursor-not-allowed"}`}
            >
              {step === "submitting" ? "... Initialize Escrow" : "Initialize Escrow"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] gap-10 bg-white rounded-[30px] p-12 shadow-[0_20px_60px_rgba(15,61,46,0.08)] border border-gray-100">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#ECFDF5] text-[#10B981]">
            <ShieldCheck size={32} />
          </div>
          <div className="text-center max-w-xl">
            <h1 className="text-3xl font-bold text-[#0F3D2E] mb-3">Secure Escrow Initialized</h1>
            <p className="text-gray-500">We’ve generated the secure payment link. Share this with the buyer to fund the escrow.</p>
          </div>
          <div className="w-full max-w-2xl bg-[#F8FAF9] border border-[#D1E7DD] rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0F5132] mb-3">External Payment Link</p>
            <div className="flex items-center gap-3 rounded-2xl bg-white border border-gray-200 p-4">
              <input
                type="text"
                readOnly
                title="External payment link"
                aria-label="External payment link"
                value="https://escrowafrica.com/secure/pay/xxxcm tzl"
                className="flex-1 bg-transparent text-sm text-gray-900 focus:outline-none"
              />
              <button type="button" className="rounded-2xl bg-[#0F3D2E] px-4 py-2 text-sm font-semibold text-white">
                Copy
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <button className="flex-1 rounded-2xl border border-gray-200 bg-white py-4 text-sm font-semibold text-[#0F3D2E] hover:bg-gray-50 transition-colors">
              Agreement PDF
            </button>
            <Link href="/dashboard/escrows" className="flex-1 rounded-2xl bg-[#0F3D2E] py-4 text-sm font-semibold text-white text-center hover:bg-[#185541] transition-colors">
              Back to Lab
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
