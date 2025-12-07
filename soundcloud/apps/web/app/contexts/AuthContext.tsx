"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "@/lib/api/apiClient";
import { toast } from "sonner";
import authApi from "@/lib/api/authApi";
import { useAuthStore } from "@/store/authStore";

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (data: { accessToken: string; user: any }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Zustand Store
  useEffect(() => {
    useAuthStore.getState().setUser(user);
  }, [user]);

  // --- 1. Check Login khi F5 trang ---
  useEffect(() => {
    const checkAuthOnLoad = async () => {
      try {
        // Gọi API refresh. 
        // Vì cookie "refresh_token" là HttpOnly, nó tự động được gửi đi.
        // Không cần check localStorage.
        const response = await authApi.refresh();

        const { accessToken, user } = response.data;

        // Cập nhật State để UI hiển thị đúng
        setAccessToken(accessToken);
        setUser(user);

      } catch (error) {
        // Nếu refresh lỗi (cookie hết hạn hoặc không có cookie)
        // Coi như chưa đăng nhập
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthOnLoad();
  }, []);

  // --- 2. Hàm Login (Gọi sau khi nhập email/pass thành công) ---
  const login = (data: { accessToken: string; user: any }) => {
    // Backend đã set Cookie trong response header rồi
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  // --- 3. Hàm Logout ---
  const logout = async () => {
    try {
      // Gọi API Logout để Backend xóa Cookies (Access + Refresh)
      await axiosClient.post("/auth/logout");

      toast.success("Đã đăng xuất!");
    } catch (error) {
      console.error("Lỗi đăng xuất", error);
    } finally {
      // Xóa State React
      setUser(null);
      setAccessToken(null);

      // Tùy chọn: Refresh trang hoặc đẩy về login
      // window.location.href = "/login";
    }
  };

  const value = {
    user,
    accessToken,
    isLoggedIn: !!user, // Hoặc !!accessToken
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};