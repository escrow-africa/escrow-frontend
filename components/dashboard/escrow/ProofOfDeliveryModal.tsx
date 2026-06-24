"use client";

import React from "react";
import { X, Truck, ShieldCheck, ExternalLink, FileText } from "lucide-react";

interface ProofOfDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofUrl?: string | null;
  deliveredAt?: string | null;
}

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url);
}

function isPdf(url: string) {
  return /\.pdf(\?.*)?$/i.test(url);
}

export default function ProofOfDeliveryModal({ isOpen, onClose, proofUrl, deliveredAt }: ProofOfDeliveryModalProps) {
  if (!isOpen) return null;

  const formattedDate = deliveredAt
    ? new Date(deliveredAt).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <div className="flex items-center gap-3">
            <Truck className="text-gray-900" size={20} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Proof of Delivery</h2>
              {formattedDate && (
                <p className="text-xs text-gray-400 mt-0.5">Submitted {formattedDate}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-2 overflow-y-auto flex-1 custom-scrollbar">
          {proofUrl ? (
            <div className="bg-[#F8FAF9] p-4 rounded-2xl mb-4">
              {isImage(proofUrl) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={proofUrl}
                  alt="Proof of delivery"
                  className="w-full rounded-xl object-contain max-h-[450px]"
                />
              ) : isPdf(proofUrl) ? (
                <iframe
                  src={proofUrl}
                  title="Proof of delivery"
                  className="w-full rounded-xl"
                  style={{ height: "450px", border: "none" }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <div className="w-16 h-16 rounded-2xl bg-[#E6F4EA] flex items-center justify-center">
                    <FileText size={28} className="text-[#0F3D2E]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Proof document attached</p>
                    <p className="text-xs text-gray-400 mb-4">This file type cannot be previewed inline.</p>
                    <a
                      href={proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F3D2E] text-white text-sm font-semibold rounded-xl hover:bg-[#185541] transition-colors"
                    >
                      <ExternalLink size={14} />
                      Open File
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#F8FAF9] p-4 rounded-2xl mb-4 flex flex-col items-center justify-center py-16 gap-3">
              <FileText size={32} className="text-gray-300" />
              <p className="text-sm text-gray-400 font-medium">No proof has been uploaded yet.</p>
            </div>
          )}

          {/* Verification Box */}
          <div className="bg-[#0B132B] rounded-2xl p-6 text-white shadow-lg mb-2">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-[#F5A623]" />
              <h3 className="text-sm font-bold tracking-wider">ESCROW AFRICA VERIFICATION</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              This proof of delivery was submitted by the seller and is stored securely.
              Funds will not be released until you confirm delivery or the inspection period expires.
            </p>
            {proofUrl && (
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#F5A623] uppercase tracking-wider hover:text-white transition-colors"
              >
                <ExternalLink size={12} />
                Open in new tab
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl bg-[#0F3D2E] text-white font-semibold hover:bg-[#185541] transition-colors"
          >
            Back to Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
