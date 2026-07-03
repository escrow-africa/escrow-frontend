"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Megaphone, Check, ArrowLeft, Plus, Minus, X } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createAd } from "@/api/ads";
import SuccessModal from "@/components/SuccessModal";
import PlatformAdCard from "@/components/dashboard/ads/PlatformAdCard";
import { Ad, AdTheme, TargetAudience } from "@/types/ads";

const PRESETS = [
  { id: "fintech", name: "Modern Fintech Flow", path: "/ad1.png" },
  { id: "devhub", name: "Developer Hub", path: "/ad2.png" },
  { id: "blueprint", name: "High-Tech Blueprint", path: "/ad1.png" },
  { id: "abstract", name: "Stunning Abstract Art", path: "/ad2.png" },
];

export default function CreateAdPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form States - Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form States - Step 2
  const [placementSlot, setPlacementSlot] = useState("Search Feed Spotlight (Top Verification)");
  const [category, setCategory] = useState("Web Development");
  const [targetAudience, setTargetAudience] = useState<TargetAudience>("All Visitors");
  const [startDate, setStartDate] = useState("2026-06-17");
  const [endDate, setEndDate] = useState("2026-06-26");

  // Form States - Step 3
  const [dailyBudget, setDailyBudget] = useState(5.00);
  const [totalBudget, setTotalBudget] = useState(150.00);
  const [badgeLabel, setBadgeLabel] = useState<string>("");
  const [theme, setTheme] = useState<AdTheme>("Standard Classic");

  // Overlay / Modal States
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const parsedPrice = useMemo(() => {
    const normalized = price.replace(/[^0-9.]/g, "");
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : 0;
  }, [price]);

  // Validation
  const canContinueStep1 = useMemo(() => {
    const hasImage = Boolean(previewUrl || selectedPreset);
    return Boolean(title.trim() && description.trim() && parsedPrice > 0 && hasImage);
  }, [title, description, parsedPrice, previewUrl, selectedPreset]);

  // Daily budget circulation calculations
  const circulationStats = useMemo(() => {
    const minViews = Math.round(dailyBudget * 110);
    const maxViews = Math.round(dailyBudget * 230);
    const avgClicks = Math.round(dailyBudget * 6.4);
    return {
      viewsRange: `${minViews.toLocaleString()} - ${maxViews.toLocaleString()} views`,
      clicks: `~${avgClicks} clicks`,
    };
  }, [dailyBudget]);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setPreviewUrl("");
      setImageDataUrl("");
      return;
    }

    setSelectedPreset(null); // Clear preset if custom file is selected
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Unable to read image file."));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    setImageDataUrl(dataUrl);
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    setImageDataUrl("");
  };

  const getActiveImage = () => {
    if (selectedPreset) {
      const preset = PRESETS.find((p) => p.id === selectedPreset);
      return preset ? preset.path : "/ad1.png";
    }
    return previewUrl || imageDataUrl || "/ad1.png";
  };

  const handlePublish = async () => {
    setShowPreviewModal(false);
    setIsSubmitting(true);
    try {
      await createAd({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        image: getActiveImage(),
        placementSlot,
        category,
        targetAudience,
        startDate,
        endDate,
        dailyBudget,
        totalBudget,
        badgeLabel: badgeLabel || undefined,
        theme,
      });

      setIsSubmitting(false);
      setShowSuccessModal(true);
    } catch {
      toast.error("Unable to publish campaign. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Stepper controllers
  const adjustDailyBudget = (amount: number) => {
    setDailyBudget((prev) => Math.max(1, +(prev + amount).toFixed(2)));
  };

  const adjustTotalBudget = (amount: number) => {
    setTotalBudget((prev) => Math.max(10, +(prev + amount).toFixed(2)));
  };

  // Simulated ad object for previewing
  const previewAdObj = useMemo<Ad>(() => {
    return {
      id: "PREVIEW",
      title: title || "Your Ad Title",
      description: description || "Your ad description will appear here.",
      price: parsedPrice,
      image: getActiveImage(),
      status: "ACTIVE",
      views: 0,
      clicks: 0,
      placementSlot,
      category,
      targetAudience,
      startDate,
      endDate,
      dailyBudget,
      totalBudget,
      spentBudget: 0,
      badgeLabel: badgeLabel || undefined,
      theme,
    };
  }, [title, description, parsedPrice, selectedPreset, previewUrl, imageDataUrl, placementSlot, category, targetAudience, startDate, endDate, dailyBudget, totalBudget, badgeLabel, theme]);

  return (
    <div className="flex flex-col h-full fade-in pb-12 px-4 max-w-4xl mx-auto">
      {currentStep <= 3 ? (
        <>
          {/* Top Back navigation */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => router.push("/dashboard/ads")}
              className="inline-flex items-center gap-2 text-sm text-[#667171] hover:text-black font-semibold transition"
            >
              <ArrowLeft size={16} />
              <span>Back to Advertisement</span>
            </button>
          </div>

          {/* Main Form container */}
          <div className="rounded-3xl border border-[#E4E8E6] bg-white p-6 md:p-10 shadow-[0_15px_50px_rgba(15,61,46,0.05)]">
            {/* Step indicator header */}
            <div className="text-center mb-8 border-b border-[#F3F4F6] pb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F3D2E]">Create Advertisement</h1>
              <p className="mt-2 text-sm text-[#667171]">Promote your services to reach more buyers.</p>
              
              {/* Visual dots indicators */}
              <div className="flex justify-center items-center gap-3 mt-5">
                <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentStep >= 1 ? "bg-[#0F3D2E] scale-110" : "bg-gray-200"}`} />
                <span className="w-8 h-[1px] bg-gray-200" />
                <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentStep >= 2 ? "bg-[#0F3D2E] scale-110" : "bg-gray-200"}`} />
                <span className="w-8 h-[1px] bg-gray-200" />
                <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentStep >= 3 ? "bg-[#0F3D2E] scale-110" : "bg-gray-200"}`} />
              </div>
            </div>

            {/* STEP 1: Basic details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
                    Product/Service Title
                  </span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Premium React Developer Kit"
                    className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]/20"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
                    Description
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Give a compelling description. Include target audiences and general highlights..."
                    className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]/20 resize-none"
                  />
                </label>

                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">Base Price (₦)</span>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]/20"
                    />
                  </label>

                  <div className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">Upload Image</span>
                    <button
                      type="button"
                      onClick={handleSelectFile}
                      className={`flex w-full items-center gap-3 rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-left transition hover:bg-gray-100 ${
                        previewUrl ? "border-[#0F3D2E]" : ""
                      }`}
                    >
                      <span className="text-[#667171]">
                        <ImageIcon size={16} />
                      </span>
                      <span className="text-xs font-semibold text-[#0F3D2E]">
                        {previewUrl ? "Change File" : "Select File"}
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {previewUrl && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#0F3D2E] font-semibold">
                        <Check size={14} />
                        <span>Custom image loaded</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Presets Row */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171] block">
                    Or Select from Premium Cover Presets
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PRESETS.map((preset) => {
                      const isSelected = selectedPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handlePresetSelect(preset.id)}
                          className={`relative flex flex-col rounded-2xl border overflow-hidden p-2 text-left bg-[#F7F8F9] transition ${
                            isSelected 
                              ? "border-[#0F3D2E] ring-1 ring-[#0F3D2E]/20" 
                              : "border-[#E4E3E3] hover:border-gray-400"
                          }`}
                        >
                          <div className="relative h-20 w-full rounded-xl overflow-hidden bg-gray-200 mb-2">
                            <NextImage
                              src={preset.path}
                              alt={preset.name}
                              fill
                              sizes="100px"
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#0f3d2e] leading-tight line-clamp-1">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-6 border-t border-[#F3F4F6] mt-8">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/ads")}
                    className="flex-1 rounded-2xl border border-[#E4E3E3] bg-white py-3.5 text-sm font-bold text-[#0F3D2E] hover:bg-[#F7F8F9] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!canContinueStep1}
                    onClick={() => setCurrentStep(2)}
                    className={`flex-1 rounded-2xl py-3.5 text-sm font-bold text-white transition ${
                      canContinueStep1
                        ? "bg-[#0F3D2E] hover:bg-[#185541]"
                        : "bg-[#BCC7C3] cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Placement, Auditing and Duration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
                      Promotion Placement Slot
                    </span>
                    <select
                      value={placementSlot}
                      onChange={(e) => setPlacementSlot(e.target.value)}
                      className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E]"
                    >
                      <option value="Search Feed Spotlight (Top Verification)">Search Feed Spotlight (Top Verification)</option>
                      <option value="Right Hand Side Widgets (Persistent Flow)">Right Hand Side Widgets (Persistent Flow)</option>
                      <option value="Sponsored Header Banners (Maximum Visibility)">Sponsored Header Banners (Maximum Visibility)</option>
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
                      Industry Category
                    </span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E]"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Apps">Mobile Apps</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Logo Design">Logo Design</option>
                      <option value="Brand Guidelines">Brand Guidelines</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="SEO Marketing">SEO Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>

                {/* Target Audience selection */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171] block">
                    Target Core Audience
                  </span>
                  <div className="grid gap-3 md:grid-cols-3">
                    {([
                      { id: "All Visitors", title: "All Visitors", desc: "Sellers & Buyers" },
                      { id: "Talent Providers", title: "Talent Providers", desc: "Target Freelancers" },
                      { id: "Hiring Managers", title: "Hiring Managers", desc: "Target Work Clients" },
                    ] as const).map((aud) => {
                      const isSelected = targetAudience === aud.id;
                      return (
                        <button
                          key={aud.id}
                          type="button"
                          onClick={() => setTargetAudience(aud.id)}
                          className={`flex flex-col text-left p-4 rounded-2xl border transition ${
                            isSelected 
                              ? "border-[#0f3d2e] bg-[#E5F7F0]/30" 
                              : "border-[#E4E3E3] hover:border-gray-400 bg-[#F7F8F9]"
                          }`}
                        >
                          <span className="text-xs font-bold text-black mb-0.5">{aud.title}</span>
                          <span className="text-[10px] text-[#667171]">{aud.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Start and End dates */}
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
                      Start Date
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E]"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
                      End Date
                    </span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E]"
                    />
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-6 border-t border-[#F3F4F6] mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 rounded-2xl border border-[#E4E3E3] bg-white py-3.5 text-sm font-bold text-[#0F3D2E] hover:bg-[#F7F8F9] transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 rounded-2xl bg-[#0F3D2E] py-3.5 text-sm font-bold text-white hover:bg-[#185541] transition"
                  >
                    Continue Campaign
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Budget and Design styles */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Daily budget stepper */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171] block">
                      Bidding Daily Budget (₦)
                    </span>
                    <div className="flex items-center gap-2 rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] p-1.5 h-[54px]">
                      <button
                        type="button"
                        onClick={() => adjustDailyBudget(-1.00)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#E4E3E3] text-[#0F3D2E] hover:bg-[#FAFBFA]"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={dailyBudget}
                        onChange={(e) => setDailyBudget(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="flex-1 text-center bg-transparent border-none text-sm text-[#0F3D2E] font-bold outline-none h-full"
                      />
                      <button
                        type="button"
                        onClick={() => adjustDailyBudget(1.00)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#E4E3E3] text-[#0F3D2E] hover:bg-[#FAFBFA]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Total budget limit stepper */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171] block">
                      Total Allocated Budget Limit (₦)
                    </span>
                    <div className="flex items-center gap-2 rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] p-1.5 h-[54px]">
                      <button
                        type="button"
                        onClick={() => adjustTotalBudget(-10.00)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#E4E3E3] text-[#0F3D2E] hover:bg-[#FAFBFA]"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        step="5.00"
                        min="10"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(Math.max(10, parseFloat(e.target.value) || 0))}
                        className="flex-1 text-center bg-transparent border-none text-sm text-[#0F3D2E] font-bold outline-none h-full"
                      />
                      <button
                        type="button"
                        onClick={() => adjustTotalBudget(10.00)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#E4E3E3] text-[#0F3D2E] hover:bg-[#FAFBFA]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Circulation calc box */}
                <div className="rounded-2xl border border-[#A7F3D0] bg-[#E5F7F0]/30 p-5 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F3D2E]">
                    Daily Circulation Calculations
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-[#667171] block uppercase tracking-wider mb-0.5">Estimated Views</span>
                      <span className="text-sm font-bold text-[#0F3D2E]">{circulationStats.viewsRange}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#667171] block uppercase tracking-wider mb-0.5">Projected Clicks (Avg)</span>
                      <span className="text-sm font-bold text-[#0F3D2E]">{circulationStats.clicks}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
                      Badge Label
                    </span>
                    <select
                      value={badgeLabel}
                      onChange={(e) => setBadgeLabel(e.target.value)}
                      className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E]"
                    >
                      <option value="">None</option>
                      <option value="FEATURED">Featured</option>
                      <option value="HOT DEAL">Hot Deal</option>
                      <option value="TOP RATED">Top Rated</option>
                      <option value="OUT OF FUEL">Out of Fuel</option>
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667171]">
                      Presentation Theme
                    </span>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as AdTheme)}
                      className="w-full rounded-2xl border border-[#E4E3E3] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E]"
                    >
                      <option value="Standard Classic">Standard Classic</option>
                      <option value="Neon Theme">Neon Theme</option>
                      <option value="Luxury Theme">Luxury Theme</option>
                      <option value="Cyberpunk Theme">Cyberpunk Theme</option>
                    </select>
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-6 border-t border-[#F3F4F6] mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 rounded-2xl border border-[#E4E3E3] bg-white py-3.5 text-sm font-bold text-[#0F3D2E] hover:bg-[#F7F8F9] transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 rounded-2xl bg-[#0F3D2E] py-3.5 text-sm font-bold text-white hover:bg-[#185541] transition"
                  >
                    See Ad Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-full fade-in pb-12 px-4 max-w-2xl mx-auto w-full">
          {/* Top Back navigation */}
          <div className="mb-8 self-start">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 text-sm text-[#667171] hover:text-black font-semibold transition"
            >
              <ArrowLeft size={16} />
              <span>Back to Advertisement</span>
            </button>
          </div>

          {/* Centered Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#0F3D2E] tracking-tight">Advertisement Preview</h1>
            <p className="mt-2 text-sm text-[#667171]">How it displays across platform.</p>
          </div>

          {/* Platform Ad Card */}
          <div className="mb-8 w-full">
            <PlatformAdCard ad={previewAdObj} />
          </div>

          {/* Publish Button */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handlePublish}
              className="w-full rounded-2xl bg-[#0F3D2E] py-4 text-sm font-bold text-white shadow-sm hover:bg-[#185541] transition-all hover:scale-[1.01]"
            >
              Publish Campaign
            </button>
            <p className="text-xs text-[#667171] text-center">
              Initial allocated balance of ₦5,000 will be loaded to the ad.
            </p>
          </div>
        </div>
      )}

      {/* LOADER OVERLAY: Publishing campaign */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-4xl bg-white p-8 text-center shadow-[0_25px_70px_rgba(15,61,46,0.12)]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F7F0] text-[#0F3D2E]">
              <Megaphone className="h-8 w-8 animate-bounce" />
            </div>
            <h2 className="text-2xl font-semibold text-[#0F3D2E]">Publishing Advertisement</h2>
            <p className="mt-3 text-sm text-[#667171]">
              We&apos;re setting up your advertisement on the marketplace.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-[#0F3D2E]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-semibold text-xs">Working on it...</span>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Advertisement Published"
        description="Your ad campaign is now live on the marketplace."
        buttonText="View Campaigns"
        redirectTo="/dashboard/ads"
      />
    </div>
  );
}

