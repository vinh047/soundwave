"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. Import hook điều hướng
import { LogOut, User, Settings, ChevronDown, CheckCircle, Loader2 } from "lucide-react";

export function AdminHeader() {
  const router = useRouter(); // 2. Khởi tạo router
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State cho thông báo (Toast) và trạng thái đang xử lý
  const [toast, setToast] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC ĐĂNG XUẤT THEO USE CASE ---
  const handleLogout = () => {
    // Bước 1: Khóa tương tác
    setIsLoggingOut(true);
    setIsOpen(false); // Đóng dropdown cho gọn

    // Bước 2: Hiển thị thông báo (Dòng sự kiện chính 1)
    setToast("Bạn đã đăng xuất thành công");

    // Bước 3: Giả lập xử lý và chuyển hướng (Dòng sự kiện chính 2)
    setTimeout(() => {
      // Xóa token hoặc dữ liệu đăng nhập ở đây (nếu có)
      // localStorage.removeItem("adminToken"); 
      // --- THÊM DÒNG NÀY: Xóa vé ---
      localStorage.removeItem("adminToken");
      // Chuyển về giao diện đăng nhập (Hậu điều kiện)
      router.push("/admin-login"); 
    }, 1500); // Đợi 1.5 giây để người dùng đọc thông báo
  };

  return (
    <>
      {/* --- PHẦN TOAST NOTIFICATION (Thông báo nổi) --- */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-5">
          <CheckCircle size={20} />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* --- MÀN HÌNH CHỜ (Overlay khi đang logout) --- */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center text-white">
            <Loader2 size={40} className="animate-spin text-orange-500 mb-2" />
            <p className="text-sm font-medium">Đang đăng xuất...</p>
          </div>
        </div>
      )}

      <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
        <h1 className="text-sm font-medium text-zinc-400">
          Trung tâm quản trị hệ thống
        </h1>

        <div className="flex items-center gap-4" ref={dropdownRef}>
          <div className="relative">
            {/* Nút Avatar Trigger */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 hover:bg-zinc-900 py-1.5 px-2 rounded-full transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-orange-900/20">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-white">Admin</p>
                <p className="text-[10px] text-zinc-500">Super User</p>
              </div>
              <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-zinc-800 mb-1">
                  <p className="text-sm font-medium text-white">Tài khoản</p>
                  <p className="text-xs text-zinc-500">admin@soundcloud.com</p>
                </div>
                
                {/* <button className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                  <User size={14} /> Hồ sơ cá nhân
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                  <Settings size={14} /> Cài đặt
                </button> */}
                
                <div className="border-t border-zinc-800 mt-1 pt-1">
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}