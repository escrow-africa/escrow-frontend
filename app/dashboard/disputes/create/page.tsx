"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, X, AlertCircle, ChevronDown, Check } from "lucide-react";
import { disputeApi } from "../../../../api/dispute";
import { escrowApi } from "../../../../api/escrow";
import toast from "react-hot-toast";

type FormState = "form" | "submitted";

interface ContractOption {
  id: string;
  escrowCode: string;
  description?: string;
  amount: number;
}

function CreateDisputeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedEscrowId = searchParams.get("escrowId");
  const [formState, setFormState] = useState<FormState>("form");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contracts, setContracts] = useState<ContractOption[]>([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(true);
  const [formData, setFormData] = useState({
    contract: "",
    contractCode: "",
    breachCategory: "Quality Issue",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const loadContracts = async () => {
      try {
        // Escrows where the current user is either the buyer or the seller
        // (the backend already scopes /escrow?preset=active to buyerId/sellerId OR userId).
        // getActive() defaults to page 1/limit 20 - a generous cap for a dropdown, not a full list.
        const response: any = await escrowApi.getActive(1, 100);
        const list: ContractOption[] = Array.isArray(response) ? response : response?.data || [];
        setContracts(list);

        if (preselectedEscrowId) {
          const match = list.find((c: ContractOption) => c.id === preselectedEscrowId);
          if (match) {
            setFormData((prev) => ({ ...prev, contract: match.id, contractCode: match.escrowCode }));
          }
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Unable to load your active contracts");
      } finally {
        setIsLoadingContracts(false);
      }
    };
    loadContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("relatedContractId", formData.contract);
    payload.append("contract", formData.contractCode || formData.contract);
    payload.append("breachCategory", formData.breachCategory);
    payload.append("amount", formData.amount.replace(/[^0-9.]/g, ""));
    payload.append("disputedAmount", formData.amount.replace(/[^0-9.]/g, ""));
    payload.append("description", formData.description);
    payload.append("claimDescription", formData.description);
    selectedFiles.forEach((file) => payload.append("proofOfBreach", file));

    try {
      await disputeApi.create(payload);
      setFormState("submitted");
      toast.success("Dispute submitted");
      setTimeout(() => {
        router.push("/dashboard/disputes");
      }, 2000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to submit dispute");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Back Button */}
      <div className="max-w-xl mx-auto flex items-center justify-start">
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 font-bold text-xs flex items-center gap-1 transition-colors"
        >
          <span>←</span> Cancel & Return
        </button>
      </div>

      {formState === "form" ? (
        /* Form Card Container */
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
          {/* Page Title & Subtitle inside Card */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              File New Arbitration Dispute
            </h1>
            <p className="text-xs text-gray-400 mt-1.5 font-medium max-w-sm mx-auto leading-normal">
              Freeze locked collateral and submit legal claim for mediator review.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Related Contract / Order Ref */}
            <div className="relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Related Contract / Order Ref
              </label>
              <div className="relative">
                <select
                  required
                  disabled={isLoadingContracts}
                  value={formData.contract}
                  onChange={(e) => {
                    const selected = contracts.find((c) => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      contract: e.target.value,
                      contractCode: selected?.escrowCode || "",
                    });
                  }}
                  className="w-full px-4 py-3 bg-[#FAFBFA] border border-gray-100 text-xs font-semibold text-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-transparent appearance-none cursor-pointer disabled:opacity-60"
                >
                  <option value="">
                    {isLoadingContracts
                      ? "Loading your active contracts…"
                      : contracts.length === 0
                      ? "No active contracts found"
                      : "Select Active Contract"}
                  </option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.escrowCode}
                      {c.description ? ` (${c.description})` : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Breach Category */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Breach Category
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.breachCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, breachCategory: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#FAFBFA] border border-gray-100 text-xs font-semibold text-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="Quality Issue">Quality Issue</option>
                  <option value="Delayed Delivery">Delayed Delivery / Missed Deadline</option>
                  <option value="Communication">Communication Cessation / Idle Vendor</option>
                  <option value="Out of Scope">Out of Scope Demands / Contract Violation</option>
                  <option value="Other">Other Unresolved Dispute</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Disputed Amount */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Disputed Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">₦</span>
                <input
                  type="text"
                  required
                  placeholder="e.g., 500.00 (up to locked contract size)"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full pl-8 pr-10 py-3 bg-[#FAFBFA] border border-gray-100 text-xs font-semibold text-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Claim Description */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Claim Description
              </label>
              <textarea
                required
                placeholder="Provide precise details of the contract breach. Cite missing deliverables, code errors, or design mismatch against original requirements. This statement is critical for automated and human arbitration panels."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#FAFBFA] border border-gray-100 text-xs font-medium text-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-transparent resize-none h-28 leading-relaxed placeholder:text-gray-400"
              />
            </div>

            {/* File Upload Component */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Mandatory Proof of Breach (Image or Video) *
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-100 hover:border-gray-200 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-white"
              >
                <input
                  type="file"
                  multiple
                  id="file-input"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,video/*"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0F0] flex items-center justify-center mx-auto mb-3">
                    <Upload size={18} className="text-[#E53E3E]" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    Drag & Drop files or click to upload evidence file
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium tracking-wider uppercase">
                    Accepts screenshots, video screencast, design export (.png, .mp4, etc.)
                  </p>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl"
                    >
                      <span className="text-xs font-semibold text-gray-700 truncate max-w-[85%]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submission Blocked Warning (Visible when no proof is uploaded) */}
            {selectedFiles.length === 0 && (
              <div className="bg-[#FFF5F5] border border-[#FFE3E3] rounded-xl p-4 flex gap-3 items-center">
                <AlertCircle size={16} className="text-[#E53E3E] fill-white flex-shrink-0" />
                <p className="text-[11px] text-[#C53030] font-semibold leading-none">
                  Submission Blocked: You must upload visual proof of breach to raise arbitration.
                </p>
              </div>
            )}

            {/* Regulatory Notice (Always shown) */}
            <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl p-4 flex gap-3 items-start">
              <AlertCircle size={16} className="text-[#D97706] fill-white flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#B45309]">
                  Regulatory Notice
                </p>
                <p className="text-[10px] text-[#B45309] font-medium leading-relaxed mt-0.5">
                  Once submitted, the active escrow custody wallet is instantly suspended. The counterparty has 72 hours to respond with rebuttals before automated multi-sig escrow mediation takes full authority over the funds.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-800 rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedFiles.length === 0 || isSubmitting}
                className="flex-1 px-4 py-3 bg-[#E53E3E] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <AlertCircle size={14} className="fill-white text-[#E53E3E]" />
                <span>{isSubmitting ? "Submitting…" : "Submit Claim & Freeze Funds"}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Success State */
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6">
            <Check size={24} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Dispute Submitted
          </h2>
          <p className="text-xs text-gray-400 font-medium max-w-sm leading-normal">
            Your dispute has been successfully filed. The counterparty has 72 hours to respond. Redirecting...
          </p>
        </div>
      )}
    </div>
  );
}

export default function CreateDisputePage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
      <CreateDisputeForm />
    </Suspense>
  );
}
