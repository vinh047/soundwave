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
       
        <AdminHeader /> 

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}