"use client";

import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Lucide Icons
import {
  Music,
  LogOut,
  User,
  List,
  Shield,
  Search,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Home,
  Rss,
  Library,
  Upload,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import userApi from "@/lib/api/usersApi";

// --- Component NavLink (Không thay đổi, đã dùng Tailwind) ---
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center h-16 px-3 text-sm font-medium
        border-b-2 transition-all
        ${
          isActive
            ? "border-orange-500 text-white"
            : "border-transparent text-gray-400 hover:text-white"
        }
      `}
    >
      {children}
    </Link>
  );
};

// --- Component Button (Thay thế cho Shadcn Button) ---
// Dùng cho các nút actions bên phải
const BaseButton = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "link" | "primary"; // Thêm primary cho Create Account
  size?: "default" | "icon";
  onClick?: () => void;
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  let variantStyles = "";
  let sizeStyles = "";

  switch (variant) {
    case "primary":
      variantStyles =
        "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500";
      break;
    case "ghost":
      variantStyles =
        "text-gray-300 hover:bg-gray-800 hover:text-white rounded-full";
      break;
    case "link":
      variantStyles = "bg-transparent underline-offset-4 hover:underline";
      break;
    case "default":
    default:
      variantStyles =
        "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500";
      break;
  }

  switch (size) {
    case "icon":
      sizeStyles = "h-10 w-10 p-0";
      break;
    case "default":
    default:
      sizeStyles = "h-10 py-2 px-4";
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Component DropdownMenu (Thay thế cho Shadcn Dropdown) ---
// Tối giản, chỉ dùng logic hiển thị/ẩn và Tailwind
const UserDropdown = ({
  session,
  userInitials,
  isAdmin,
  router,
}: {
  session: any;
  userInitials: string;
  isAdmin: boolean;
  router: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsOpen(false);
  };

  const DropdownItem = ({
    onClick,
    icon,
    children,
    className = "",
  }: {
    onClick: () => void;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm text-gray-300 cursor-pointer hover:bg-gray-700 transition-colors ${className}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  );

  return (
    <div className="relative">
      {/* Trigger */}
      <BaseButton
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="relative h-10 w-10 rounded-full p-0"
      >
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          {session.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user?.name || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold text-sm">
              {userInitials}
            </span>
          )}
        </div>
      </BaseButton>

      {/* Content */}
      {isOpen && (
        <div
          onBlur={() => setIsOpen(false)}
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 origin-top-right animate-in fade-in-0 zoom-in-95"
          tabIndex={-1}
        >
          <div className="py-1">
            {/* Label */}
            <div className="px-4 py-2">
              <p className="text-sm font-medium leading-none text-white">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-gray-400">
                {session.user?.email}
              </p>
            </div>
            <div className="border-t border-gray-700 my-1"></div>
            {/* Items */}
            <DropdownItem
              onClick={() => {
                router.push("/profile");
                setIsOpen(false);
              }}
              icon={<User className="mr-2 h-4 w-4" />}
            >
              Profile
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                router.push("/playlists");
                setIsOpen(false);
              }}
              icon={<List className="mr-2 h-4 w-4" />}
            >
              Playlists
            </DropdownItem>
            {isAdmin && (
              <>
                <div className="border-t border-gray-700 my-1"></div>
                <DropdownItem
                  onClick={() => {
                    router.push("/admin");
                    setIsOpen(false);
                  }}
                  icon={<Shield className="mr-2 h-4 w-4" />}
                  className="text-red-400 hover:text-red-400"
                >
                  Admin Panel
                </DropdownItem>
              </>
            )}
            <div className="border-t border-gray-700 my-1"></div>
            <DropdownItem
              onClick={handleSignOut}
              icon={<LogOut className="mr-2 h-4 w-4" />}
            >
              Sign out
            </DropdownItem>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Component Input (Thay thế cho Shadcn Input) ---
const BaseInput = ({ className, ...props }: any) => (
  <input
    className={`
      flex h-10 w-full rounded-md border
      border-gray-700 bg-gray-800 px-1 py-1 text-sm
      text-white placeholder:text-gray-400
      focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#111]
      disabled:cursor-not-allowed disabled:opacity-50
      transition-colors
      ${className}
    `}
    {...props}
  />
);

// --- Component NavLink cho Mobile Menu ---
const MobileNavLink = ({
  href,
  children,
  icon,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center w-full px-3 py-2 rounded-md text-base font-medium
        transition-colors
        ${
          isActive
            ? "bg-gray-700 text-white" // Trạng thái active
            : "text-gray-400 hover:bg-gray-700 hover:text-white" // Trạng thái thường
        }
      `}
    >
      {icon}
      {children}
    </Link>
  );
};

export function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getUserById("user_admin");
        setSession(res?.data || null);
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        setSession(null);
      }
    };

    fetchUser();
  }, []);

  const isAdmin = session?.user?.email === "demo@soundcloud.com";
  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "SC";

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="relative top-0 w-full bg-[#111] border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* === 1. Logo & Nav Links (Bên trái) === */}
          <div className="flex items-center gap-2 h-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 h-16 pr-4 shrink-0"
            >
              <div className="bg-orange-500 p-2 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center h-full">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/feed">Feed</NavLink>
              <NavLink href="/library">Library</NavLink>
              <NavLink href="/upload">Upload</NavLink>
            </div>
          </div>

          {/* === 2. Search Bar (Ở giữa) === */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <BaseInput
                type="search"
                placeholder="Tìm kiếm..."
                className="w-full pl-10 h-10"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* === 3. Actions & User Menu (Bên phải) === */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {session ? (
              <>
                <BaseButton
                  onClick={() => router.push("/pro")}
                  variant="link"
                  className="text-orange-500 hover:text-orange-400 hidden lg:inline-flex h-10 px-3"
                >
                  Try Artist Pro
                </BaseButton>
                <BaseButton
                  onClick={() => router.push("/artists")}
                  variant="link"
                  className="text-gray-300 hover:text-white hidden lg:inline-flex h-10 px-3"
                >
                  For Artists
                </BaseButton>

                <UserDropdown
                  session={session}
                  userInitials={userInitials}
                  isAdmin={isAdmin}
                  router={router}
                />

                <BaseButton
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hidden sm:flex"
                  onClick={() => router.push("/notifications")}
                >
                  <Bell className="h-5 w-5" />
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hidden sm:flex"
                  onClick={() => router.push("/messages")}
                >
                  <MessageSquare className="h-5 w-5" />
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hidden sm:flex"
                  onClick={() => router.push("/more")}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </BaseButton>
              </>
            ) : (
              <>
                <BaseButton
                  onClick={() => router.push("/auth/signin")}
                  variant="ghost"
                  className="text-gray-300 hover:text-white h-10 px-3 hidden sm:flex"
                >
                  Sign In
                </BaseButton>
                <BaseButton
                  onClick={() => router.push("/auth/signup")}
                  variant="primary"
                  className="h-10 px-4"
                >
                  Create account
                </BaseButton>
                <BaseButton
                  onClick={() => router.push("/pro")}
                  variant="link"
                  className="text-orange-500 hover:text-orange-400 hidden lg:inline-flex h-10 px-3"
                >
                  Try Artist Pro
                </BaseButton>
              </>
            )}

            {/* Mobile Menu Button */}
            <BaseButton
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </BaseButton>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Content (Ẩn trên md) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-gray-800 transition-all duration-300 ease-in-out">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink
              href="/"
              icon={<Home className="mr-2 h-4 w-4" />}
              onClick={closeMobileMenu}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              href="/feed"
              icon={<Rss className="mr-2 h-4 w-4" />}
              onClick={closeMobileMenu}
            >
              Feed
            </MobileNavLink>
            <MobileNavLink
              href="/library"
              icon={<Library className="mr-2 h-4 w-4" />}
              onClick={closeMobileMenu}
            >
              Library
            </MobileNavLink>
            <MobileNavLink
              href="/upload"
              icon={<Upload className="mr-2 h-4 w-4" />}
              onClick={closeMobileMenu}
            >
              Upload
            </MobileNavLink>

            {session && (
              <>
                <div className="border-t border-gray-700 my-2"></div>
                <MobileNavLink
                  href="/notifications"
                  icon={<Bell className="mr-2 h-4 w-4" />}
                  onClick={closeMobileMenu}
                >
                  Notifications
                </MobileNavLink>
                <MobileNavLink
                  href="/messages"
                  icon={<MessageSquare className="mr-2 h-4 w-4" />}
                  onClick={closeMobileMenu}
                >
                  Messages
                </MobileNavLink>
              </>
            )}

            {!session && (
              <>
                <div className="border-t border-gray-700 my-2"></div>
                <BaseButton
                  onClick={() => {
                    router.push("/auth/signin");
                    closeMobileMenu();
                  }}
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white h-10 px-3"
                >
                  Sign In
                </BaseButton>
                <BaseButton
                  onClick={() => {
                    router.push("/pro");
                    closeMobileMenu();
                  }}
                  variant="link"
                  className="w-full justify-start text-orange-500 hover:text-orange-400 h-10 px-3"
                >
                  Try Artist Pro
                </BaseButton>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
