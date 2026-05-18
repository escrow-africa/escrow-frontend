"use client";

import Image from "next/image";
import { Search, Bell, User, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "../../ThemeToggle";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  onMenuClick?: () => void;
}

export default function Header({
  userName = "Madeleine Nkiru",
  userRole = "Verified Seller",
  avatarUrl = "",
  onMenuClick,
}: HeaderProps) {
  const pathname = usePathname() || "";
  
  // Determine title based on current path
  let title = "Dashboard";
  if (pathname.includes("/dashboard/escrows")) title = "Escrows";
  else if (pathname.includes("/dashboard/wallet")) title = "Wallet";
  else if (pathname.includes("/dashboard/create-escrow")) title = "Create Escrow";
  else if (pathname.includes("/dashboard/disputes")) title = "Disputes";
  else if (pathname.includes("/dashboard/notifications")) title = "Notifications";
  else if (pathname.includes("/dashboard/settings")) title = "Settings";
  else if (pathname.includes("/dashboard/help")) title = "Help";

  return (
    <header className="h-20 bg-surface border-b border-border flex items-center justify-between px-4 md:px-8 z-10 w-full">
      {/* Left Side: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-surface-hover"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary capitalize">{title}</h1>
          <div className="w-8 md:w-12 h-1 bg-accent rounded-full mt-1"></div>
        </div>
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Search Bar (Hidden on mobile for now, or scaled down) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search escrows, transactions,..."
            className="pl-10 pr-4 py-2 w-72 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground text-foreground"
          />
        </div>
        
        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-surface-hover">
          <Search size={20} />
        </button>

        <ThemeToggle />

        {/* Notification Bell */}
        <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-surface-hover">
          <Bell size={20} />
          {/* Notification Badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border border-surface"></span>
        </button>

        <div className="hidden md:block w-px h-8 bg-muted"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-primary">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={40}
              height={40}
              className="rounded-full border border-muted object-cover"
            />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted border border-muted flex items-center justify-center text-muted-foreground">
              <User size={18} className="md:w-5 md:h-5" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
