"use client";

import { Button } from "@/components/ui/Button";
import { CheckCircle, Music, User, AlertTriangle, EyeOff } from "lucide-react"; 
import { useState } from "react";

// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (FIX LỖI TYPESCRIPT)
interface Report {
  id: number;
  reporter: string;
  targetType: string;
  targetName: string;
  reason: string;
  status: string;
  date: string;
  resolvedAt: string | null; // Cho phép chứa chuỗi ngày tháng hoặc null
  actionTaken: string | null; // Cho phép chứa hành động hoặc null
}

// 2. Mock Data ban đầu
const INITIAL_REPORTS: Report[] = [
  {
    id: 1,
    reporter: "user123",
    targetType: "Track",
    targetName: "Remix Copyrighted 2024",
    reason: "Vi phạm bản quyền",
    status: "pending", 
    date: "20/03/2024 08:30", 
    resolvedAt: null,
    actionTaken: null, 
  },
  {
    id: 2,
    reporter: "user456",
    targetType: "User",
    targetName: "Spammer Account",
    reason: "Spam bình luận",
    status: "pending",
    date: "19/03/2024 14:15",
    resolvedAt: null,
    actionTaken: null,
  },
];

export default function ReportsPage() {
  // TypeScript giờ đã hiểu reports là mảng các object theo chuẩn Report interface
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [filter, setFilter] = useState("pending");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProcessReport = (id: number, action: string) => { // Có thể để action: string cho đơn giản
    const isError = Math.random() < 0.1; 

    if (isError) {
      showToast("Lỗi: Xử lý báo cáo thất bại", "error");
      return; 
    }

    const now = new Date().toLocaleString("vi-VN");
    
    setReports(prev => prev.map(report => {
      if (report.id === id) {
        return {
          ...report,
          status: "processed", 
          resolvedAt: now, // Giờ TypeScript sẽ không báo lỗi dòng này nữa
          actionTaken: action 
        };
      }
      return report;
    }));

    let actionText = "";
    if (action === "hide") actionText = "Đã ẩn bài hát vi phạm";
    if (action === "warn") actionText = "Đã gửi cảnh cáo tới người dùng";
    if (action === "ignore") actionText = "Đã bỏ qua báo cáo";

    showToast(`Thành công: ${actionText}.`, "success");
  };

  return (
    <div className="space-y-6 relative">
      {/* --- PHẦN TOAST NOTIFICATION --- */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* --- HEADER & FILTER --- */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Xử lý báo cáo vi phạm</h2>
        
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${filter === "pending" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Chờ xử lý
          </button>
          <button
            onClick={() => setFilter("processed")}
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${filter === "processed" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Đã xử lý
          </button>
        </div>
      </div>

      {/* --- DANH SÁCH BÁO CÁO --- */}
      <div className="grid gap-4">
        {reports
          .filter(r => filter === "pending" ? r.status === "pending" : r.status === "processed")
          .map((report) => (
          <div 
            key={report.id} 
            className="flex flex-col md:flex-row md:items-start justify-between p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
          >
            {/* Cột thông tin bên trái */}
            <div className="flex items-start gap-4 mb-4 md:mb-0">
              <div className={`p-3 rounded-full ${report.targetType === 'Track' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {report.targetType === 'Track' ? <Music size={20} /> : <User size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{report.targetName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded border border-zinc-700 text-zinc-400 bg-zinc-800">
                    {report.targetType}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">
                  Lý do: <span className="text-red-400 font-medium">{report.reason}</span>
                </p>
                <div className="mt-2 text-xs text-zinc-500">
                   Báo cáo lúc: {report.date} • Bởi: {report.reporter}
                </div>
                
                {report.status === "processed" && (
                  <div className="mt-3 text-sm flex items-center gap-2 text-emerald-400">
                    <CheckCircle size={14} />
                    Đã xử lý lúc {report.resolvedAt} 
                    <span className="text-zinc-500">
                      (Hành động: {report.actionTaken === 'hide' ? 'Ẩn bài' : report.actionTaken === 'warn' ? 'Cảnh cáo' : 'Bỏ qua'})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cột nút bấm hành động */}
            {report.status === "pending" && (
              <div className="flex flex-col gap-2 min-w-[170px]">
                <Button 
                  onClick={() => handleProcessReport(report.id, "ignore")}
                  light 
                  className="w-full justify-start text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                >
                  <CheckCircle size={14} className="mr-2" /> Bỏ qua
                </Button>

                {report.targetType === 'User' ? (
                  <Button 
                     onClick={() => handleProcessReport(report.id, "warn")}
                     light 
                     className="w-full justify-start text-xs border-yellow-700/50 text-yellow-500 hover:bg-yellow-900/20"
                  >
                    <AlertTriangle size={14} className="mr-2" /> Gửi cảnh cáo
                  </Button>
                ) : (
                  <Button 
                     onClick={() => handleProcessReport(report.id, "hide")}
                     dark 
                     className="w-full justify-start text-xs bg-red-600 hover:bg-red-700 text-white border-none"
                  >
                    <EyeOff size={14} className="mr-2" /> Ẩn bài hát
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}

        {reports.filter(r => filter === "pending" ? r.status === "pending" : r.status === "processed").length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            Không có báo cáo nào ở mục này.
          </div>
        )}
      </div>
    </div>
  );
}