"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Search, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { getAdminUsers, updateAdminUserStatus } from "@/lib/api/adminApi";
import { AdminUser } from "@/type/AdminTypes";
import { format } from "date-fns";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. State quản lý thông báo (Toast)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 2. Hàm hiển thị thông báo (Tự tắt sau 3 giây)
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminUsers({ page, limit: 10 });
      setUserList(data.data);
      // Fix: Calculate totalPages from total and limit
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showToast("Lỗi: Không thể tải danh sách người dùng", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Logic xử lý Khóa/Mở khóa (Hiện tại API updateAdminUserStatus chưa hoạt động hoàn hảo do BE hạn chế, nhưng vẫn tích hợp)
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    // Lưu ý: Logic này đang giả định status dựa trên role hoặc field nào đó, 
    // nhưng AdminUser interface hiện tại chưa có field 'status' hay 'isBanned' rõ ràng ngoài role.
    // Tạm thời ta sẽ giả định logic update sẽ gửi request lên server.

    // const isLocking = currentStatus === 'active';
    // const actionName = isLocking ? "Khoá" : "Mở khoá";

    try {
      // Gọi API update (cần BE hỗ trợ)
      // await updateAdminUserStatus(userId, { isBanned: isLocking });

      // Refresh list
      // await fetchUsers();

      showToast(`Tính năng cập nhật trạng thái đang được phát triển`, "success");

    } catch (error) {
      showToast(`Lỗi: Không thể cập nhật trạng thái`, "error");
    }
  };

  const filteredUsers = userList.filter((user) =>
    (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* --- PHẦN TOAST NOTIFICATION --- */}
      {/* Chỉ hiện khi state toast có dữ liệu */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:bg-white/20 p-1 rounded-full">
            <X size={14} />
          </button>
        </div>
      )}
      {/* ------------------------------- */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Quản lý người dùng</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 w-full md:w-80"
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/50">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900 text-zinc-400 font-medium">
            <tr>
              <th className="px-6 py-4 w-24">ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Ngày tham gia</th>
              <th className="px-6 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/80 transition-colors">
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                    {user.id.substring(0, 8)}...
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300`}>
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name || "Chưa đặt tên"}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {user.role === 'ADMIN' ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-500 border border-purple-500/20">
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        User
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-zinc-400">
                    {format(new Date(user.createdAt), "dd/MM/yyyy")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-start gap-2">
                      <Button className="h-8 w-20 text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50">
                        Chi tiết
                      </Button>

                      {/* Tạm thời disable nút khóa vì chưa có field status */}
                      <Button
                        className="h-8 w-20 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 opacity-50 cursor-not-allowed"
                        onClick={() => handleToggleStatus(user.id, 'active')}
                        disabled
                      >
                        Khóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  Không tìm thấy kết quả nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}