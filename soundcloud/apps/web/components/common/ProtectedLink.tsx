"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import thêm để check active
import { useAuthStore } from "@/store/authStore";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { cn } from "@/lib/utils"; // Dùng cn để gộp class cho gọn

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isProtected?: boolean;
}

export default function ProtectedLink({
  href,
  children,
  className,
  isProtected = true, // Mặc định là CÓ bảo vệ (bạn có thể đổi thành false nếu muốn)
}: ProtectedLinkProps) {
  // 1. Logic lấy user và modal (từ ProtectedLink cũ)
  const { user } = useAuthStore();
  const authModal = useAuthModal();

  // 2. Logic kiểm tra đường dẫn hiện tại (từ NavLink cũ)
  const pathname = usePathname();
  const isActive = pathname === href;

  // 3. Xử lý sự kiện Click
  const handleClick = (e: React.MouseEvent) => {
    if (isProtected && !user) {
      e.preventDefault(); // Chặn chuyển trang
      authModal.onOpen(); // Mở modal
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        // CSS Gốc từ NavLink
        "flex items-center h-16 px-3 text-sm font-medium border-b-2 transition-all",
        
        // CSS Trạng thái Active/Inactive
        isActive
          ? "border-orange-500 text-gray-900 dark:text-white"
          : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
          
        // Cho phép ghi đè thêm class từ bên ngoài nếu cần
        className
      )}
    >
      {children}
    </Link>
  );
}