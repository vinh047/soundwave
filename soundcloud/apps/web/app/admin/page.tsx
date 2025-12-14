"use client";

import { Users, Music, AlertTriangle, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats, DashboardStats } from "@/lib/api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Tổng quan</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Tổng người dùng"
          value={loading ? "..." : stats?.totalUsers.toLocaleString() || "0"}
          icon={Users}
        />
        <StatCard
          title="Tổng bài hát"
          value={loading ? "..." : stats?.totalTracks.toLocaleString() || "0"}
          icon={Music}
        />
        <StatCard
          title="Báo cáo chờ xử lý"
          value={loading ? "..." : stats?.pendingReports.toLocaleString() || "0"}
          icon={AlertTriangle}
          urgent={stats?.pendingReports ? stats.pendingReports > 0 : false}
        />
        {/* <StatCard 
          title="Đang truy cập" 
          value="1,200" 
          icon={Activity} 
          trend="Live" 
        /> */}
      </div>

    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, urgent }: any) {
  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${urgent ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs">
        <span className={urgent ? "text-red-400 font-bold" : "text-emerald-400"}>
          {trend}
        </span>
      </div>
    </div>
  );
}