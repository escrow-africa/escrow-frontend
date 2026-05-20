"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Sidebar from "../../components/dashboard/layout/Sidebar";
import Header from "../../components/dashboard/layout/Header";
import { getTokenFromCookie } from "../../utils/token";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const getSavedName = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("user_fullName");
        if (saved) return saved;
      }
      const token = getTokenFromCookie();
      if (token) {
        try {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          return decoded.fullName || decoded.name || decoded.username || decoded.email || "";
        } catch (e) {
          return "";
        }
      }
      return "";
    };

    const fullName = getSavedName();
    if (fullName) {
      let name = fullName.includes("@") ? fullName.split("@")[0] : fullName;
      name = name.replace(/[._-]/g, " ");
      const firstWord = name.trim().split(" ")[0];
      const capitalized = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
      setUserName(capitalized);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFBFA] text-gray-900 font-sans">

      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userName={userName} 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        <main className="flex-1 overflow-y-auto w-full">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
