"use client";

import { useRouter, usePathname } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import {
  useEffect,
  useState,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
} from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

import {
  Music,
  LogOut,
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
  UserIcon,
} from "lucide-react";

import { User } from "@repo/database";
import authApi from "@/lib/api/authApi"; // ✅ Đã dùng authApi thay cho userApi
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useAuth } from "@/app/contexts/AuthContext";

// --- 1. COMPONENTS PHỤ (NavLink, BaseButton, BaseInput) ---

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
            ? "border-orange-500 text-gray-900 dark:text-white"
            : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }
      `}
    >
      {children}
    </Link>
  );
};

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "link" | "primary";
  size?: "default" | "icon";
}

const BaseButton = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}: BaseButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer dark:focus:ring-offset-[#111]";

  let variantStyles = "";
  let sizeStyles = "";

  switch (variant) {
    case "primary":
      variantStyles =
        "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500";
      break;
    case "ghost":
      variantStyles =
        "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white rounded-full";
      break;
    case "link":
      variantStyles = "bg-transparent underline-offset-4 hover:underline";
      break;
    case "default":
    default:
      variantStyles =
        "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:ring-gray-500";
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

const BaseInput = ({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`
      flex h-10 w-full rounded-md border text-sm transition-colors
      border-gray-300 bg-white text-gray-900 placeholder:text-gray-400
      focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none
      disabled:cursor-not-allowed disabled:opacity-50
      dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-offset-[#111]
      ${className}
    `}
    {...props}
  />
);

// --- 2. COMPONENT USER DROPDOWN (Đã fix Avatar & Logout) ---

interface UserDropdownProps {
  user: User;
  userInitials: string;
  isAdmin: boolean;
  router: AppRouterInstance;
}

const UserDropdown = ({
  user,
  userInitials,
  isAdmin,
  router,
}: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Hàm Logout chuẩn: Gọi API -> Xóa Cookie -> Refresh trang
  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsOpen(false);
      router.push("/");
      router.refresh(); // F5 lại trạng thái Server Component
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      router.push("/");
    }
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
      className={`flex items-center px-4 py-2 text-sm cursor-pointer transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${className}`}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </div>
  );

  return (
    <div className="relative">
      <BaseButton
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 focus:ring-2 focus:ring-orange-500"
      >
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user?.name || "User"}
              // ✅ Fix Next.js Image: Thêm width/height và object-cover
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <span className="font-semibold text-sm text-gray-600 dark:text-white select-none">
              {userInitials}
            </span>
          )}
        </div>
      </BaseButton>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 origin-top-right animate-in fade-in-0 zoom-in-95 dark:bg-[#1a1a1a] dark:ring-gray-800 dark:border dark:border-gray-800">
            <div className="py-1">
              <div className="px-4 py-2">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

              <DropdownItem
                onClick={() => {
                  router.push(`/artist/${user.id}`);
                  setIsOpen(false);
                }}
                icon={<UserIcon className="h-4 w-4" />}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  router.push("/playlists");
                  setIsOpen(false);
                }}
                icon={<List className="h-4 w-4" />}
              >
                Playlists
              </DropdownItem>

              {isAdmin && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <DropdownItem
                    onClick={() => {
                      router.push("/admin");
                      setIsOpen(false);
                    }}
                    icon={<Shield className="h-4 w-4" />}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Admin Panel
                  </DropdownItem>
                </>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

              {/* ✅ Gọi hàm handleLogout */}
              <DropdownItem
                onClick={handleLogout}
                icon={<LogOut className="h-4 w-4" />}
              >
                Logout
              </DropdownItem>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

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
            ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        }
      `}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  );
};

// --- 3. NAVBAR CHÍNH ---

export function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const authModal = useAuthModal();
  const handleAuth = () => {
    return authModal.onOpen();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Gọi API lấy thông tin người dùng hiện tại (dựa trên Cookie)
        const res = await authApi.getProfile();
        // Ép kiểu dữ liệu trả về cho khớp với State
        setUser(res.data as unknown as User);
      } catch (error) {
        // Nếu lỗi (401 Unauthorized), coi như chưa đăng nhập
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const isAdmin = user?.email === "demo@soundcloud.com"; // Logic admin tạm thời

  // Tạo ký tự đầu tên cho Avatar fallback
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "SC";

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 dark:bg-[#111] dark:border-gray-800 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* === LEFT: Logo & Nav Links === */}
          <div className="flex items-center gap-2 h-full">
            <Link
              href="/"
              className="flex items-center gap-2 h-16 pr-4 shrink-0"
            >
              <div className="bg-orange-500 p-2 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="hidden lg:block font-bold text-lg dark:text-white">
                SoundWave
              </span>
            </Link>

            <div className="hidden md:flex items-center h-full">
              <NavLink href="/home">Home</NavLink>
              <NavLink href="/feed">Feed</NavLink>
              <NavLink href="/library">Library</NavLink>
              <NavLink href="/upload">Upload</NavLink>
            </div>
          </div>

          {/* === CENTER: Search Bar === */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <BaseInput
                type="search"
                placeholder="Tìm kiếm nghệ sĩ, bài hát..."
                className="w-full pl-10 h-10"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* === RIGHT: Actions & User Menu === */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <ThemeToggle />

            {user ? (
              <>
                <BaseButton
                  onClick={() => router.push("/pro")}
                  variant="link"
                  className="text-orange-500 hover:text-orange-600 hidden lg:inline-flex h-10 px-3"
                >
                  Try Artist Pro
                </BaseButton>

                <BaseButton
                  onClick={() => router.push("/artists")}
                  variant="link"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hidden xl:inline-flex h-10 px-3"
                >
                  For Artists
                </BaseButton>

                {/* Dropdown User Info */}
                <UserDropdown
                  user={user}
                  userInitials={userInitials}
                  isAdmin={isAdmin}
                  router={router}
                />
              </>
            ) : (
              <>
                <BaseButton
                  onClick={handleAuth}
                  variant="ghost"
                  className="hidden sm:flex"
                >
                  Sign In
                </BaseButton>
                <BaseButton
                  onClick={handleAuth}
                  variant="primary"
                >
                  Create account
                </BaseButton>
              </>
            )}

            {/* Mobile Menu Trigger */}
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

      {/* --- Mobile Menu Content --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800 shadow-xl">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="mb-4 relative">
              <BaseInput
                type="search"
                placeholder="Tìm kiếm..."
                className="w-full pl-10"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <MobileNavLink
              href="/"
              icon={<Home className="h-4 w-4" />}
              onClick={closeMobileMenu}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              href="/feed"
              icon={<Rss className="h-4 w-4" />}
              onClick={closeMobileMenu}
            >
              Feed
            </MobileNavLink>
            <MobileNavLink
              href="/library"
              icon={<Library className="h-4 w-4" />}
              onClick={closeMobileMenu}
            >
              Library
            </MobileNavLink>
            <MobileNavLink
              href="/upload"
              icon={<Upload className="h-4 w-4" />}
              onClick={closeMobileMenu}
            >
              Upload
            </MobileNavLink>

            {!user && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <BaseButton
                  onClick={() => {
                    router.push("/auth/signin");
                    closeMobileMenu();
                  }}
                  variant="ghost"
                  className="w-full justify-start h-10 px-3"
                >
                  Sign In
                </BaseButton>
                <BaseButton
                  onClick={() => {
                    router.push("/pro");
                    closeMobileMenu();
                  }}
                  variant="link"
                  className="w-full justify-start text-orange-500 h-10 px-3"
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
