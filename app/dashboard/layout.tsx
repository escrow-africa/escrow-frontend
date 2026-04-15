import React, { ReactNode } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFBFA] text-gray-900 font-sans">

      <Sidebar />


      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        <Header />


        <main className="flex-1 overflow-y-auto w-full">
          <div className="mx-auto max-w-7xl px-8 py-8 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
