"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Megaphone, Check } from "lucide-react";
import NextImage from "next/image";
import toast from "react-hot-toast";
import { createAd } from "@/api/ads";
import SuccessModal from "@/components/SuccessModal";

export default function CreateAdPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const canPublish = Boolean(title.trim() && description.trim() && parsedPrice > 0);

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

  const handlePublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canPublish) return;

    setIsSubmitting(true);
    try {
      await createAd({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        image: imageDataUrl || previewUrl || "/ad1.png",
      });

      setIsSubmitting(false);
      setShowSuccessModal(true);
    } catch {
      toast.error("Unable to publish advert. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="flex justify-center pb-12 px-4">
      <div className="w-full max-w-3xl">
        <div className="rounded-xl border border-[#E4E8E6] bg-white p-8 shadow-[0_25px_70px_rgba(15,61,46,0.08)]">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold ">Create Advertisement</h1>
            <p className="mt-3  font-semibold text-sm text-muted-foreground">Promote your services to reach more buyers.</p>
          </div>

          <form className="space-y-6" onSubmit={handlePublish}>
            <label className="block space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#667171]">
                Product/Service Name
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Premium Logo Design Pack"
                className="w-full rounded-xl border border-[#E4E8E6] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
              />
            </label>

            <label className="block space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#667171]">
                Description
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="Describe what you’re offering in detail..."
                className="w-full rounded-xl border border-[#E4E8E6] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <label className="block space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#667171]">Price (₦)</span>
                <input
                  type="text"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-[#E4E8E6] bg-[#F7F8F9] px-5 py-4 text-sm text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
                />
              </label>

              <div className="block space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#667171]">Upload Image</span>
                <button
                  type="button"
                  onClick={handleSelectFile}
                  className="group flex w-full items-center gap-3 rounded-xl border border-[#E4E8E6] bg-[#F7F8F9] px-5 py-4 text-left transition"
                >
                  <span className="inline-flex items-center justify-center text-[#5D6D69]">
                    <ImageIcon size={15} />
                  </span>
                  <span className="text-xs font-semibold">Select File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  aria-label="Upload advertisement image"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {imageDataUrl && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    <Check size={16} />
                    <span>Image uploaded successfully</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={handlePreview}
                disabled={isSubmitting}
                className={`rounded-xl border border-[#E4E8E6] bg-white px-6 py-4 text-sm font-semibold text-[#0F3D2E] transition ${
                  isSubmitting ? "cursor-not-allowed opacity-60" : "hover:bg-[#F7F8F9]"
                }`}
              >
                Preview Ad
              </button>
              <button
                type="submit"
                disabled={!canPublish || isSubmitting}
                className={`rounded-xl px-6 py-4 text-sm font-semibold text-white transition ${
                  canPublish && !isSubmitting
                    ? "bg-[#0F3D2E] hover:bg-[#123f30]"
                    : "bg-[#BCC7C3] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Publishing..." : "Publish Ad"}
              </button>
            </div>
          </form>

          {showPreview && (
            <div className="mt-8 rounded-xl border border-[#E4E8E6] bg-[#F8FAF9] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="relative h-32 w-full overflow-hidden rounded-3xl bg-[#E7ECEA] md:h-32 md:w-40">
                  {previewUrl ? (
                    <NextImage
                      src={previewUrl}
                      alt="Ad preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#5D6D69]">
                      No image selected
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#667171]">Preview</p>
                  <h2 className="mt-3 text-xl font-semibold text-[#0F3D2E]">{title || "Your ad title"}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#4A5550]">{description || "Your ad description will appear here."}</p>
                  <p className="mt-4 text-lg font-semibold text-[#0F3D2E]">₦{parsedPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {isSubmitting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-4xl bg-white p-8 text-center shadow-[0_25px_70px_rgba(15,61,46,0.12)]">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F7F0] text-[#0F3D2E]">
                  <Megaphone className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0F3D2E]">Publishing Advertisement</h2>
                <p className="mt-3 text-sm text-[#4A5550]">
                  We&apos;re setting up your advertisement on the marketplace.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-[#0F3D2E]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Working on it...</span>
                </div>
              </div>
            </div>
          )}

          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="Advertisement Published"
            description="Your ad is now live on the marketplace."
            buttonText="View Ads"
            redirectTo="/dashboard/ads"
          />
        </div>
      </div>
    </div>
  );
}
