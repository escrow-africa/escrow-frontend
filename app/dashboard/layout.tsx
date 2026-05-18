"use client";

import React, { ReactNode, useState } from "react";
import Sidebar from "../../components/dashboard/layout/Sidebar";
import Header from "../../components/dashboard/layout/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFBFA] text-gray-900 font-sans">

      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto w-full">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
