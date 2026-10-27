import React from "react";
import { X, FileText, Download } from "lucide-react";

interface LegalAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalAgreementModal({ isOpen, onClose }: LegalAgreementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-[24px] w-full max-w-2xl overflow-hidden shadow-xl animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-transparent">
          <div className="flex items-center gap-3">
            <FileText className="text-gray-900" size={20} />
            <h2 className="text-xl font-bold text-gray-900">Legal Agreement</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="px-6 py-2 overflow-y-auto flex-1 custom-scrollbar">
          <div className="bg-[#F8FAF9] p-4 rounded-xl">
            {/* Document Paper */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 min-h-[500px]">
              
              {/* Document Header Stylized */}
              <div className="flex justify-between items-start border-b-2 border-[#166055] pb-6 mb-8">
                <div className="bg-[#1D1D1D] text-white w-12 h-12 flex items-center justify-center text-xl font-bold rounded-sm">
                  T.
                </div>
                <div className="text-right flex flex-col justify-end h-12">
                  <p className="text-[9px] text-gray-500 font-medium tracking-wide">yourinfo@emailaddress.com | www.Template.net | 222 555 7777</p>
                </div>
              </div>

              {/* Document Content */}
              <h3 className="text-xl font-bold text-center text-gray-900 mb-8">Agreement Letter</h3>

              <div className="space-y-4 text-xs text-gray-800 leading-relaxed font-medium">
                <p className="font-bold">[Your Company Name]</p>
                <p className="font-bold">[Your Company Address]</p>
                
                <p className="pt-4">May 1, 2050</p>
                <p className="font-bold">Dear Jordan Smith,</p>
                <p>
                  This letter serves as an agreement between <span className="font-bold">[Your Company Name]</span> and Jordan Smith for
                  consulting services. Both parties agree to the following terms:
                </p>

                <div className="pt-2 pl-2">
                  <p>
                    <span className="font-bold">1. Services/Tasks:</span> Jordan Smith will provide consulting services in digital transformation
                    strategy, including market analysis, process optimization, and technology integration, for
                    <span className="font-bold"> [Your Company Name]</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 flex gap-4 mt-2">
          <button className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Download size={18} />
            Download PDF
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl bg-[#0F3D2E] text-white font-semibold hover:bg-[#185541] transition-colors"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
