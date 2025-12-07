"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Flag, Music, LogOut } from "lucide-react";
import { cn } from "@/lib/utils"; 

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý Users",
    href: "/admin/users",
    icon: Users, 
  },
  {
    title: "Báo cáo & Vi phạm",
    href: "/admin/reports",
    icon: Flag, 
  },
  {
    title: "Kho bài hát",
    href: "/admin/tracks",
    icon: Music, 
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-zinc-800">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          SoundCloud Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-600/10 text-orange-500"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.title}
            </Link>
          );
        })}
      </nav>

    
    </aside>
  );
}