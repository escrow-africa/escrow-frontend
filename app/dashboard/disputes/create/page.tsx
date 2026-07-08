"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, AlertCircle } from "lucide-react";

type FormState = "form" | "submitted";

export default function CreateDisputePage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("form");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    contract: "",
    breachCategory: "",
    amount: "",
    description: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitted");

    console.log("Dispute submitted:", {
      ...formData,
      files: selectedFiles,
    });

    // Close after 2 seconds
    setTimeout(() => {
      router.push("/dashboard/disputes");
    }, 2000);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 font-medium text-sm"
        >
          ← Cancel & Return
        </button>
      </div>

      {formState === "form" ? (
        <>
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              File New Arbitration Dispute
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Freeze locked collateral and submit legal claim for mediator review.
            </p>
          </div>

          {/* Main Content */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Related Contract / Order Ref */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
                Related Contract / Order Ref
              </label>
              <select
                required
                value={formData.contract}
                onChange={(e) =>
                  setFormData({ ...formData, contract: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:border-transparent"
              >
                <option value="">Select Active Contract</option>
                <option value="BUY-723">BUY-723 (Premium Web Application Design)</option>
                <option value="BUY-724">BUY-724 (Smart Contract Audit)</option>
                <option value="BUY-725">BUY-725 (E-Commerce Platform Implementation)</option>
              </select>
            </div>

            {/* Breach Category */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
                Breach Category
              </label>
              <select
                required
                value={formData.breachCategory}
                onChange={(e) =>
                  setFormData({ ...formData, breachCategory: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:border-transparent"
              >
                <option value="">Select Breach Category</option>
                <option value="Quality Issue">Quality Issue / Deficient Code</option>
                <option value="Delayed Delivery">Delayed Delivery / Missed Deadline</option>
                <option value="Communication">Communication Cessation / Idle Vendor</option>
                <option value="Out of Scope">Out of Scope Demands / Contract Violation</option>
                <option value="Other">Other Unresolved Dispute</option>
              </select>
            </div>

            {/* Disputed Amount */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
                Disputed Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-600">₦</span>
                <input
                  type="number"
                  required
                  placeholder="e.g., 500.00 (up to locked contract size)"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:border-transparent"
                />
              </div>
            </div>

            {/* Claim Description */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
                Claim Description
              </label>
              <textarea
                required
                placeholder="Provide precise details of the contract breach. Cite missing deliverables, code errors, or design mismatch against original requirements. This statement is critical for automated and human arbitration panels."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:border-transparent resize-none h-24"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
                Mandatory Proof of Breach (Image or Video) *
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0F3D2E] transition-colors cursor-pointer"
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
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">
                    Drag & Drop files or click to upload evidence file
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepts screenshots, videos screencast, design export / psd, mfx, etc.
                  </p>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submission Blocked Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">
                <span className="font-bold">Submission Blocked:</span> You must upload visual proof of breach to raise arbitration.
              </p>
            </div>

            {/* Regulatory Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-yellow-900 mb-1">
                  Regulatory Notice
                </p>
                <p className="text-xs text-yellow-800">
                  Once submitted, the active escrow custody wallet is instantly suspended. The counterparty has 72 hours to respond with materials.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedFiles.length === 0}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Submit Claim & Freeze Funds
              </button>
            </div>
          </form>
        </>
      ) : (
        /* Success State */
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dispute Submitted
          </h2>
          <p className="text-sm text-gray-500">
            Your dispute has been successfully filed. The counterparty has 72 hours to respond.
          </p>
        </div>
      )}
    </div>
  );
}
