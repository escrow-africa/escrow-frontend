"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Sidebar from "../../components/dashboard/layout/Sidebar";
import Header from "../../components/dashboard/layout/Header";
import { authApi } from "../../api/auth";
import { getTokenFromCookie } from "../../utils/token";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [totalEarnings, setTotalEarnings] = useState<string | null>(null);

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

    const getSavedAvatar = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("user_avatarUrl");
        if (saved) return saved;
      }
      return "";
    };

    const updateProfileFromStorage = () => {
      const fullName = getSavedName();
      if (fullName) {
        let name = fullName.includes("@") ? fullName.split("@")[0] : fullName;
        name = name.replace(/[._-]/g, " ");
        const firstWord = name.trim().split(" ")[0];
        const capitalized = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
        setUserName(capitalized);
      }
      
      const savedAvatar = getSavedAvatar();
      setAvatarUrl(savedAvatar);
    };

    updateProfileFromStorage();

    if (typeof window !== "undefined") {
      window.addEventListener("user-profile-updated", updateProfileFromStorage);
    }

    // Fetch /auth/me and /auth/stats to populate name and sidebar earnings
    let mounted = true;
    (async () => {
      try {
        const me = await authApi.getMe();
        if (!mounted) return;
        const name = me?.fullName || me?.name || me?.username || me?.email || null;
        if (name) {
          let display = String(name);
          display = display.includes("@") ? display.split("@")[0] : display;
          display = display.replace(/[._-]/g, " ");
          const firstWord = display.trim().split(" ")[0];
          const capitalized = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
          setUserName(capitalized);
        }
        if (me?.avatarUrl) {
          setAvatarUrl(me.avatarUrl);
          if (typeof window !== "undefined") {
            localStorage.setItem("user_avatarUrl", me.avatarUrl);
          }
        }
      } catch (e) {
        // fallback: keep token/localStorage method
        console.error('Failed to fetch /auth/me', e);
      }

      try {
        const stats = await authApi.getStats();
        if (!mounted) return;
        const total = stats?.totalEarnings ?? stats?.totalEarningsAmount ?? stats?.total ?? null;
        if (total !== undefined && total !== null) {
          try {
            const n = Number(total);
            if (!Number.isNaN(n)) setTotalEarnings(new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(n));
            else setTotalEarnings(String(total));
          } catch {
            setTotalEarnings(String(total));
          }
        }
      } catch (e) {
        console.error('Failed to fetch /auth/stats', e);
      }
    })();

    return () => {
      mounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("user-profile-updated", updateProfileFromStorage);
      }
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFBFA] text-gray-900 font-sans">

      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
        totalEarnings={totalEarnings ?? undefined}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userName={userName} 
          avatarUrl={avatarUrl}
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        <main className="flex-1 overflow-y-auto w-full">
          <div className="mx-auto max-w-7xl px-2 md:px-8 py-4 md:py-4 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
