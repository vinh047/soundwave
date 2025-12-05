import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | SoundCloud Clone",
  description: "Hệ thống quản trị nội dung",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar cố định */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* Header Admin (Optional) */}
        {/* <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
            <h1 className="text-sm font-medium text-zinc-400">
              Trung tâm quản trị hệ thống
            </h1>
            <div className="flex items-center gap-4">
               {/* Avatar Admin giả lập */}
               {/* <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">
                 AD
               </div>
            </div>
        // </header> */} 
            {/* --- THAY THẾ PHẦN HEADER CŨ BẰNG DÒNG NÀY --- */}
        <AdminHeader /> 
        {/* ----------------------------------------------- */}

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}