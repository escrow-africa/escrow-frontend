"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Megaphone, Check, ArrowLeft, Plus, Minus, X } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchAd, updateAd } from "@/api/ads";
import SuccessModal from "@/components/SuccessModal";
import AdCard from "@/components/dashboard/ads/AdCard";
import { Ad, AdTheme, TargetAudience } from "@/types/ads";

const PRESETS = [
  { id: "fintech", name: "Modern Fintech Flow", path: "/ad1.png" },
  { id: "devhub", name: "Developer Hub", path: "/ad2.png" },
  { id: "blueprint", name: "High-Tech Blueprint", path: "/ad1.png" },
  { id: "abstract", name: "Stunning Abstract Art", path: "/ad2.png" },
];

interface EditAdPageProps {
  params: Promise<{ id: string }>;
}

export default function EditAdPage({ params }: EditAdPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [isLoadingAd, setIsLoadingAd] = useState(true);
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Form States - Step 3
  const [dailyBudget, setDailyBudget] = useState(5.00);
  const [totalBudget, setTotalBudget] = useState(150.00);
  const [spentBudget, setSpentBudget] = useState(0);
  const [badgeLabel, setBadgeLabel] = useState<string>("");
  const [theme, setTheme] = useState<AdTheme>("Standard Classic");

  // Overlay / Modal States
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAd(id)
      .then((data) => {
        if (!data) {
          toast.error("Campaign not found.");
          router.push("/dashboard/ads");
          return;
        }
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price.toFixed(2));
        setPlacementSlot(data.placementSlot);
        setCategory(data.category);
        setTargetAudience(data.targetAudience);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setDailyBudget(data.dailyBudget);
        setTotalBudget(data.totalBudget);
        setSpentBudget(data.spentBudget);
        setBadgeLabel(data.badgeLabel || "");
        setTheme(data.theme);

        // Check if image is one of the presets
        const matchedPreset = PRESETS.find((p) => p.path === data.image);
        if (matchedPreset) {
          setSelectedPreset(matchedPreset.id);
        } else {
          setPreviewUrl(data.image);
        }
      })
      .catch(() => {
        toast.error("Failed to fetch campaign details.");
        router.push("/dashboard/ads");
      })
      .finally(() => {
        setIsLoadingAd(false);
      });
  }, [id, router]);

  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith("/")) {
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
      return;
    }

    setSelectedPreset(null); // Clear preset if custom file is selected
    if (previewUrl && !previewUrl.startsWith("/")) {
      URL.revokeObjectURL(previewUrl);
    }
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
    if (previewUrl && !previewUrl.startsWith("/")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setImageDataUrl("");
  };

  const getActiveImage = () => {
    if (selectedPreset) {
      const preset = PRESETS.find((p) => p.id === selectedPreset);
      return preset ? preset.path : "/ad1.png";
    }
    return previewUrl || imageDataUrl || "/ad1.png";
  };

  const handleUpdate = async () => {
    setShowPreviewModal(false);
    setIsSubmitting(true);
    try {
      await updateAd(id, {
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
      toast.error("Unable to update campaign. Please try again.");
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
      id,
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
      spentBudget,
      badgeLabel: badgeLabel || undefined,
      theme,
    };
  }, [id, title, description, parsedPrice, selectedPreset, previewUrl, imageDataUrl, placementSlot, category, targetAudience, startDate, endDate, dailyBudget, totalBudget, spentBudget, badgeLabel, theme]);

  if (isLoadingAd) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-[#667171] gap-3">
        <span className="w-8 h-8 border-3 border-t-transparent border-[#0F3D2E] rounded-full animate-spin" />
        <span className="font-semibold text-sm">Loading campaign details...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full fade-in pb-12 px-4 max-w-4xl mx-auto">
      {/* Top Back navigation */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/dashboard/ads/${id}`)}
          className="inline-flex items-center gap-2 text-sm text-[#667171] hover:text-black font-semibold transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Campaign Details</span>
        </button>
      </div>

      {/* Main Form container */}
      <div className="rounded-3xl border border-[#E4E8E6] bg-white p-6 md:p-10 shadow-[0_15px_50px_rgba(15,61,46,0.05)]">
        {/* Step indicator header */}
        <div className="text-center mb-8 border-b border-[#F3F4F6] pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F3D2E]">Edit Campaign</h1>
          <p className="mt-2 text-sm text-[#667171]">Modify your advertising campaign parameters.</p>
          
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
                onClick={() => router.push(`/dashboard/ads/${id}`)}
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
                onClick={() => setShowPreviewModal(true)}
                className="flex-1 rounded-2xl bg-[#0F3D2E] py-3.5 text-sm font-bold text-white hover:bg-[#185541] transition"
              >
                See Ad Preview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: See Ad Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FAFBFA] border border-gray-200 rounded-4xl p-6 flex flex-col relative shadow-2xl">
            {/* Modal Close Button */}
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-[#667171]"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-[#0F3D2E] text-center mb-6">Campaign Preview</h3>
            
            {/* The actual Card component in previewMode */}
            <div className="mb-6">
              <AdCard ad={previewAdObj} previewMode={true} />
            </div>

            {/* Action buttons inside preview */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="flex-1 py-3.5 bg-white border border-[#E4E3E3] hover:bg-gray-50 text-[#0F3D2E] rounded-xl font-bold text-sm transition"
              >
                Go Back & Edit
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 py-3.5 bg-[#0f3d2e] hover:bg-[#185541] text-white rounded-xl font-bold text-sm transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADER OVERLAY: Updating campaign */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-4xl bg-white p-8 text-center shadow-[0_25px_70px_rgba(15,61,46,0.12)]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F7F0] text-[#0F3D2E]">
              <Megaphone className="h-8 w-8 animate-bounce" />
            </div>
            <h2 className="text-2xl font-semibold text-[#0F3D2E]">Updating Advertisement</h2>
            <p className="mt-3 text-sm text-[#667171]">
              We&apos;re updating your advertisement parameters on the marketplace.
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
        title="Advertisement Updated"
        description="Your ad campaign parameters have been updated."
        buttonText="View Campaigns"
        redirectTo="/dashboard/ads"
      />
    </div>
  );
}

