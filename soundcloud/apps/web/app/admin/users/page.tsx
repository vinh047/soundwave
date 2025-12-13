"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, X, CheckCircle, AlertCircle } from "lucide-react";

// Dữ liệu mẫu
const INITIAL_USERS = [
  { 
    id: "USR001", 
    name: "Nguyen Van A", 
    email: "vana@example.com", 
    status: "active", 
    joinDate: "20/10/2023",
    avatarColor: "bg-purple-500"
  },
  { 
    id: "USR002", 
    name: "Tran Thi B", 
    email: "btran@example.com", 
    status: "locked", 
    joinDate: "05/11/2023",
    avatarColor: "bg-blue-500"
  },
  { 
    id: "USR003", 
    name: "Le Van C", 
    email: "c.le@example.com", 
    status: "active", 
    joinDate: "01/12/2023",
    avatarColor: "bg-green-500"
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState(INITIAL_USERS);
  
  // 1. State quản lý thông báo (Toast)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 2. Hàm hiển thị thông báo (Tự tắt sau 3 giây)
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Logic xử lý Khóa/Mở khóa
  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const isLocking = currentStatus === 'active';
    const actionName = isLocking ? "Khoá" : "Mở khoá";

    try {
      // Cập nhật danh sách user
      const updatedList = userList.map(user => {
        if (user.id === userId) {
          return { ...user, status: isLocking ? 'locked' : 'active' };
        }
        return user;
      });
      setUserList(updatedList);

      // Thay alert bằng showToast
      showToast(`Thành công: Đã ${actionName} tài khoản ${userId}`, "success");
      
    } catch (error) {
      showToast(`Lỗi: Không thể ${actionName} tài khoản này`, "error");
    }
  };

  const filteredUsers = userList.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="space-y-6 relative">
      {/* --- PHẦN TOAST NOTIFICATION --- */}
      {/* Chỉ hiện khi state toast có dữ liệu */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
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
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ngày tham gia</th>
              <th className="px-6 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/80 transition-colors">
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                    {user.id}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${user.avatarColor}`} />
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500 border border-red-500/20">
                        Locked
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-zinc-400">{user.joinDate}</td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-start gap-2">
                      <Button dark className="h-8 w-20 text-xs bg-zinc-800 hover:bg-zinc-700">
                        Chi tiết
                      </Button>

                      {user.status === 'active' ? (
                        <Button 
                          dark 
                          className="h-8 w-20 text-xs bg-red-600 hover:bg-red-700 text-white border-none"
                          onClick={() => handleToggleStatus(user.id, user.status)}
                        >
                          Khóa
                        </Button>
                      ) : (
                        <Button 
                          light 
                          className="h-8 w-20 text-xs border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          onClick={() => handleToggleStatus(user.id, user.status)}
                        >
                          Mở khóa
                        </Button>
                      )}
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