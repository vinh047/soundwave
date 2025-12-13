"use client"; // Bắt buộc phải có vì dùng useEffect

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { Loader2 } from "lucide-react"; // Icon loading

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra "vé" đăng nhập
    const token = localStorage.getItem("adminToken");

    if (!token) {
      // 2. Nếu không có vé -> chuyển về trang login ngay lập tức
      router.push("/admin-login"); 
    } else {
      // 3. Có vé -> Cho phép hiển thị nội dung
      setIsAuthorized(true);
    }
  }, [router]);

  // --- MÀN HÌNH CHỜ  ---
  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-orange-500" size={40} />
          <p className="text-zinc-500 text-sm">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN CHÍNH (Chỉ hiện khi đã login) ---
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar cố định */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <AdminHeader /> 

        {/* Page Content */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}