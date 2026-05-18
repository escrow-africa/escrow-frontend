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
  LogOut,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen bg-[#0F3D2E] text-white flex flex-col font-sans overflow-y-auto scrollbar-hide transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="p-6 pb-4 shrink-0 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <Image
              src="/logo2.png"
              alt="Escrow Africa Logo"
              width={140}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-300 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Total Earnings Block */}
        <div className="px-6 py-2 mb-6 shrink-0">
          <div className="bg-[#185541] rounded-lg p-4 border border-[#236b53] shadow-inner">
            <p className="text-xs text-gray-300 uppercase font-semibold mb-1 tracking-wider text-[10px]">Total Earnings</p>
            <p className="text-2xl font-bold">₦120,500.50</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-4 space-y-1 mb-8 shrink-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
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
        <div className="px-4 shrink-0 pb-8 mt-auto">
          <div className="pt-4 border-t border-[#185541] space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
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
    </>
  );
}
