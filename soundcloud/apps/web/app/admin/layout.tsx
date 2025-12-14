"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { Loader2 } from "lucide-react"; // Icon loading
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user } = useAuth();

  console.log("user: ", user)
  useEffect(() => {
    if (!user) {
      router.push("/admin-login");
      return;
    }

    if (user.role !== "ADMIN") {
      toast.error("Bạn không có quyền truy cập trang này!");
      router.push("/");
      return;
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-orange-500" size={40} />
          <p className="text-zinc-500 text-sm">
            Đang kiểm tra quyền truy cập...
          </p>
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
        <div className="p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
