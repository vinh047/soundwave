"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // Bạn cần cài axios
import { toast } from "sonner";
import authApi from "@/lib/api/authApi";

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean; // Rất quan trọng, để hiển thị loading
  login: (data: { accessToken: string; user: any }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu là true

  // Hàm này sẽ được gọi khi trang tải LẦN ĐẦU
  useEffect(() => {
    const checkAuthOnLoad = async () => {
      try {
        const response = await authApi.refresh();

        // Nếu thành công (cookie hợp lệ) -> Đăng nhập
        const { accessToken, user } = response.data;
        setAccessToken(accessToken);
        setUser(user);
        localStorage.setItem("accessToken", accessToken);
      } catch (error) {
        console.log("Chưa đăng nhập.");
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthOnLoad();
  }, []);

  const login = (data: { accessToken: string; user: any }) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem("accessToken", data.accessToken);
  };

  const logout = async () => {
    try {
      // 1. Gọi API backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      toast.success(response.data.message || "Đã đăng xuất!");
    } catch (error) {
      toast.error("Đăng xuất thất bại.");
    } finally {
      // 4. Dọn dẹp state
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    }
  };

  const value = {
    user,
    accessToken,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
