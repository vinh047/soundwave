"use client";

import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle, Eye, Music, User, Clock } from "lucide-react"; 
import { useState } from "react";

// 1. Mock Data: Thêm trường 'resolvedAt' cho các đơn đã xử lý
const reports = [
  // --- CHỜ XỬ LÝ ---
  {
    id: 1,
    reporter: "user123",
    targetType: "Track",
    targetName: "Remix Copyrighted 2024",
    reason: "Vi phạm bản quyền",
    status: "pending", 
    date: "20/03/2024 08:30", // Ngày báo cáo
    resolvedAt: null,         // Chưa xử lý
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
  },

  // --- ĐÃ XỬ LÝ ---
  {
    id: 3,
    reporter: "mod_team",
    targetType: "Track",
    targetName: "Bad Content Song",
    reason: "Nội dung phản cảm",
    status: "Đã xử lý",
    date: "18/03/2024 09:00",
    resolvedAt: "18/03/2024 10:45", // Admin xử lý sau gần 2 tiếng
  },
  {
    id: 4,
    reporter: "system_bot",
    targetType: "User",
    targetName: "Fake User 99",
    reason: "Mạo danh",
    status: "Đã xử lý",
    date: "15/03/2024 11:20",
    resolvedAt: "15/03/2024 11:25", // Xử lý ngay lập tức
  },
];

export default function ReportsPage() {
  const [filter, setFilter] = useState("pending");

  const tabs = ["pending", "Đã xử lý"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Xử lý báo cáo</h2>
        
        {/* Filter Tabs */}
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-sm rounded-md capitalize transition-all ${
                filter === tab 
                  ? "bg-zinc-800 text-white font-medium shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab === "pending" ? "Chờ xử lý" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Report List */}
      <div className="grid gap-4">
        {reports
          .filter(r => r.status === filter)
          .map((report) => (
          <div 
            key={report.id} 
            className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
          >
            {/* Info Section */}
            <div className="flex items-start gap-4">
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
                
                {/* HIỂN THỊ THỜI GIAN LOGIC */}
                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                  <span>Báo cáo: {report.date}</span>
                  {/* Nếu đã xử lý thì hiện thêm giờ xử lý */}
                  {report.status === "Đã xử lý" && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                      <span className="text-green-500 flex items-center gap-1">
                        <Clock size={12} /> Xử lý: {report.resolvedAt}
                      </span>
                    </>
                  )}
                  {report.status === "pending" && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                      <span>Bởi: {report.reporter}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {filter === "pending" ? (
              <div className="flex items-center gap-3 mt-4 md:mt-0 ">
                <Button light className="h-9 px-3 text-xs bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                  <Eye size={14} className="mr-2" /> Xem
                </Button>
                <Button light className="h-9 px-3 text-xs border-green-900 text-green-500 hover:bg-green-900/20">
                  <CheckCircle size={14} className="mr-2" /> Bỏ qua
                </Button>
                <Button dark className="h-9 px-3 text-xs bg-red-600 hover:bg-red-700 text-white border-none">
                  <XCircle size={14} className="mr-2" /> Xử lý vi phạm
                </Button>
              </div>
            ) : (
              <div className="mt-4 md:mt-0 flex flex-col items-end gap-1">
                 <span className="text-sm font-medium text-green-500 flex items-center gap-2">
                   <CheckCircle size={16} /> Đã giải quyết
                 </span>
              </div>
            )}
          </div>
        ))}
        
        {reports.filter(r => r.status === filter).length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            Không có báo cáo nào ở trạng thái này.
          </div>
        )}
      </div>
    </div>
  );
}