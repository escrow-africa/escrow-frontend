"use client"
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Briefcase,
  Plus,
  AlertCircle,
  Bell,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Escrows", href: "/dashboard/escrows", icon: Briefcase },
    { name: "Create Escrow", href: "/dashboard/create-escrow", icon: Plus },
    { name: "Disputes", href: "/dashboard/disputes", icon: AlertCircle },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ];

  const bottomItems = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
    { name: "Logout", href: "#", icon: LogOut, textClass: "text-red-400" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0F3D2E] text-white flex flex-col font-sans">
      {/* Logo Area */}
      <div className="p-6 pb-4">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => window.location.reload()}
        >
          <Image 
            src="/logo2.png" 
            alt="Escrow Africa Logo" 
            width={140} 
            height={40} 
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Total Earnings Block */}
      <div className="px-6 py-2 mb-6">
        <div className="bg-[#185541] rounded-lg p-4 border border-[#236b53] shadow-inner">
          <p className="text-xs text-gray-300 uppercase font-semibold mb-1 tracking-wider text-[10px]">Total Earnings</p>
          <p className="text-2xl font-bold">₦120,500.50</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? "bg-[#F3B659] text-[#0F3D2E]"
                  : "text-gray-300 hover:bg-[#185541] hover:text-white"
                }`}
            >
              <Icon size={18} className={isActive ? "text-[#0F3D2E]" : "text-gray-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-[#185541]">
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-[#185541] hover:text-white ${item.textClass || "text-gray-300"}`}
              >
                <Icon size={18} className={item.textClass ? "text-red-400" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
