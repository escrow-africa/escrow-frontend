import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Calendar, Edit3, HelpCircle, FileText, XSquare } from "lucide-react";

interface EscrowDetailsDropdownProps {
  onExtendDeadline?: () => void;
  onSupport?: () => void;
}

export default function EscrowDetailsDropdown({ onExtendDeadline, onSupport }: EscrowDetailsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action?: () => void) => {
    if (action) action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 animate-fade-in-up origin-top-right">
          <div className="px-4 py-2 mb-1">
            <p className="text-sm font-semibold text-gray-500">More</p>
          </div>
          
          <button 
            onClick={() => handleAction(onExtendDeadline)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <Calendar size={16} className="text-[#00A859]" />
            Extend Deadline
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left">
            <Edit3 size={16} className="text-[#00A859]" />
            Edit Terms
          </button>
          
          <button 
            onClick={() => handleAction(onSupport)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <HelpCircle size={16} className="text-[#00A859]" />
            Transaction Support
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left">
            <FileText size={16} className="text-gray-400" />
            View Legal Contract
          </button>
          
          <div className="h-px bg-gray-100 my-1 w-full" />
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
            <XSquare size={16} />
            Cancel Escrow
          </button>
        </div>
      )}
    </div>
  );
}
