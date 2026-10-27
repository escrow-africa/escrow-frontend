"use client"
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Wallet,
  Briefcase,
  Megaphone,
  AlertCircle,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  totalEarnings?: string;
}

export default function Sidebar({ isOpen, onClose, totalEarnings }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Escrows", href: "/dashboard/escrows", icon: Briefcase },
    { name: "Ads", href: "/dashboard/ads", icon: Megaphone },
    { name: "Disputes", href: "/dashboard/disputes", icon: AlertCircle },
    { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ];

  const bottomItems = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
    { name: "Logout", href: "#", icon: LogOut, textClass: "text-red-400" },
  ];

  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

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
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#0F3D2E] text-white flex flex-col font-sans overflow-y-hidden transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="p-3 shrink-0 flex items-center justify-between">
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
        <div className="px-6 py-1 mb-3 shrink-0">
          <div className="bg-[#185541] rounded-lg py-2.5 px-4 border border-[#236b53] shadow-inner">
            <p className="text-xs text-gray-300 uppercase font-semibold mb-0.5 tracking-wider text-[10px]">Total Earnings</p>
            <p className="text-xl font-bold">{totalEarnings ?? '₦0.00'}</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-4 space-y-0.5 mb-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
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
        <div className="px-4 shrink-0 pb-2 mt-auto overflow-hidden">
          <div className="pt-2 border-t border-[#185541] space-y-0.5">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
              
              if (item.name === "Logout") {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      logout();
                      onClose();
                      router.push('/login');
                    }}
                    className={`w-full text-left flex items-center gap-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#185541] hover:text-white ${item.textClass || "text-gray-300"}`}
                  >
                    <Icon size={18} className={item.textClass ? "text-red-400" : "text-gray-400"} />
                    {item.name}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-[#F3B659] text-[#0F3D2E]"
                    : "text-gray-300 hover:bg-[#185541] hover:text-white"
                    }`}
                >
                  <Icon size={18} className={isActive ? "text-[#0F3D2E]" : "text-gray-400"} />
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
