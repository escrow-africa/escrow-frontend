
import Image from "next/image";
import { Search, Bell, User } from "lucide-react";

interface HeaderProps {
  title?: string;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export default function Header({
  title = "Dashboard",
  userName = "Madeleine Nkiru",
  userRole = "Verified Seller",
  avatarUrl = "",
}: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10 w-full">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F3D2E]">{title}</h1>
        <div className="w-12 h-1 bg-[#0F3D2E] rounded-full mt-1"></div>
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search escrows, transactions,..."
            className="pl-10 pr-4 py-2 w-72 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:text-[#0F3D2E] transition-colors rounded-full hover:bg-gray-50">
          <Bell size={20} />
          {/* Notification Badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#F3B659] rounded-full border border-white"></span>
        </button>

        <div className="w-px h-8 bg-gray-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#0F3D2E]">{userName}</p>
            <p className="text-xs text-gray-400">{userRole}</p>
          </div>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={40}
              height={40}
              className="rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
              <User size={20} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
