"use client";

import React from "react";

interface SyncLoaderProps {
  isOpen: boolean;
}

export default function SyncLoader({ isOpen }: SyncLoaderProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl p-8 max-w-xs w-full mx-4 shadow-2xl flex flex-col items-center justify-center border border-border animate-scale-in">
        {/* Loading Spinner */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#0F3D2E] dark:border-t-[#F3B659] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-[#0F3D2E] dark:text-[#F3B659] animate-pulse">
          Synchronizing...
        </p>
      </div>
    </div>
  );
}
