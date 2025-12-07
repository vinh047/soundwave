"use client";
import Link from "next/link";
import { Search, Upload, Bell, Menu } from "lucide-react";
import { Avatar } from "../ui2/Avatar";
import { Button } from "../ui2/Button";
import { useState } from "react";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/app/contexts/AuthContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-40">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-bold text-white">
              SC
            </div>
            <span className="hidden md:block font-bold text-xl">SoundCloud</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <Link href="/home" className="text-sm font-medium text-gray-300 hover:text-white">Home</Link>
            <Link href="/feed" className="text-sm font-medium text-gray-300 hover:text-white">Feed</Link>
            <Link href="/library" className="text-sm font-medium text-gray-300 hover:text-white">Library</Link>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              <>
                <Button asChild className="hidden sm:flex">
                  <Link href="/tracks/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Bell className="h-5 w-5" />
                </Button>

                <Link href={`/profile/${user.id}`}>
                  <Avatar src={user.image} alt={user.name} size={36} />
                </Link>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Create account</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}