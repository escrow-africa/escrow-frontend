"use client";

import React, { useState, useEffect, useRef } from "react";
import { Truck, CheckCircle2, Upload, X, FileText } from "lucide-react";
import { escrowApi } from "../../../api/escrow";
import toast from "react-hot-toast";

type ModalState = "confirm" | "uploading" | "success";

interface MarkDeliveredModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  onDelivered?: () => void;
}

export default function MarkDeliveredModal({ isOpen, onClose, escrowId, onDelivered }: MarkDeliveredModalProps) {
  const [modalState, setModalState] = useState<ModalState>("confirm");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setModalState("confirm");
      setSelectedFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      toast.error("Please attach proof of delivery before proceeding.");
      return;
    }
    setModalState("uploading");
    try {
      await escrowApi.deliver(escrowId, selectedFile);
      setModalState("success");
      onDelivered?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to mark as delivered. Please try again.");
      setModalState("confirm");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => modalState !== "uploading" && onClose()}
      />

      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[420px] p-8 overflow-hidden zoom-in flex flex-col items-center text-center">

        {modalState === "confirm" && (
          <div className="flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6">
              <Truck size={24} className="text-[#0F3D2E]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Deliver?</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-[300px]">
              Upload your proof of delivery. This could be a document, image, or any file that verifies completion.
            </p>

            {/* File Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full mb-6 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors ${
                selectedFile
                  ? "border-[#00A859] bg-[#F0FDF4]"
                  : "border-gray-200 hover:border-[#0F3D2E] hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#00A859]" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={22} />
                  <p className="text-xs font-semibold">Drop file here or <span className="text-[#0F3D2E]">browse</span></p>
                  <p className="text-[10px]">PDF, DOC, PNG, JPG, ZIP up to 20MB</p>
                </div>
              )}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedFile}
              className={`w-full font-semibold py-3.5 rounded-xl transition-colors mb-3 ${
                selectedFile
                  ? "bg-[#0F3D2E] hover:bg-[#185541] text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Proof &amp; Mark as Delivered
            </button>

            <button
              onClick={onClose}
              className="w-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2"
            >
              Wait, let me double check
            </button>
          </div>
        )}

        {modalState === "uploading" && (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-bold text-gray-900 animate-pulse">
              Uploading Proof &amp; Syncing...
            </h2>
            <p className="text-sm text-gray-400 mt-3">Please don&rsquo;t close this window.</p>
          </div>
        )}

        {modalState === "success" && (
          <div className="flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6">
              <CheckCircle2 size={24} className="text-[#00A859]" />
            </div>

            <h2 className="text-2xl font-bold text-[#00A859] mb-3">Delivered!</h2>

            <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
              Buyer has been notified and can now review your proof of delivery.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-[#0F3D2E] hover:bg-[#185541] text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
