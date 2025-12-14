// web/lib/api/adminApi.ts

import apiClient from "./apiClient";
import axiosClient from "./apiClient";

import {
  AdminUserList,
  ReportItem,
  AdminTrackList,
  UpdateReportActionPayload,
  UpdateTrackStatusPayload,
  UpdateUserStatusPayload
} from '../../type/AdminTypes';
import { PaginationParams } from '../../type/PaginationParams';
import { PublicUser } from "./authApi";

const ADMIN_BASE_URL = "/admin";

// =======================
// 1. Quản lý Tài khoản (Users)
// =======================

/**
 * Lấy danh sách người dùng (GET /admin/users)
 */
export const getAdminUsers = async (params: PaginationParams): Promise<AdminUserList> => {
  const response = await axiosClient.get<AdminUserList>(`${ADMIN_BASE_URL}/users`, {
    params: params,
  });
  return response.data;
};

/**
 * Cập nhật trạng thái người dùng (PATCH /admin/users/:id/status)
 * LƯU Ý: Chức năng này sẽ thất bại do BE bị hạn chế.
 */
export const updateAdminUserStatus = async (
  userId: string,
  payload: UpdateUserStatusPayload
): Promise<any> => {
  const response = await apiClient.patch<any>(
    `${ADMIN_BASE_URL}/users/${userId}/status`,
    payload
  );
  return response.data;
};

// =======================
// 2. Quản lý Báo cáo (Reports)
// =======================

/**
 * Lấy danh sách tất cả các báo cáo (GET /admin/reports)
 */
export const getAdminReports = async (): Promise<ReportItem[]> => {
  const response = await apiClient.get<ReportItem[]>(
    `${ADMIN_BASE_URL}/reports`
  );
  return response.data;
};

/**
 * Xử lý hành động trên báo cáo (PATCH /admin/reports/:id/action)
 */
export const handleReportAction = async (
  reportId: string,
  payload: UpdateReportActionPayload
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.patch<{ success: boolean; message: string }>(
    `${ADMIN_BASE_URL}/reports/${reportId}/action`,
    payload
  );
  return response.data;
};

// =======================
// 3. Quản lý Bài hát Hệ thống (Tracks)
// =======================

/**
 * Lấy danh sách bài hát hệ thống (GET /admin/tracks)
 */
export const getAdminTracks = async (
  params: PaginationParams
): Promise<AdminTrackList> => {
  const response = await apiClient.get<AdminTrackList>(
    `${ADMIN_BASE_URL}/tracks`,
    {
      params: params,
    }
  );
  return response.data;
};

/**
 * Cập nhật trạng thái bài hát (Ẩn/Hiện) (PATCH /admin/tracks/:id/status)
 */
export const updateAdminTrackStatus = async (
  trackId: string,
  payload: UpdateTrackStatusPayload
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.patch<{ success: boolean; message: string }>(
    `${ADMIN_BASE_URL}/tracks/${trackId}/status`,
    payload
  );
  return response.data;
};

// 1. Định nghĩa kiểu dữ liệu gửi lên (Payload)
export interface AdminLoginPayload {
  email: string;
  password: string;
}

// 2. Định nghĩa kiểu dữ liệu trả về (Response)
// Dựa vào this.authService.login(req.user) thường trả về access_token
export interface LoginResponse {
  accessToken: string;
  user: PublicUser
}

export const loginAdmin = async (data: AdminLoginPayload) => {
  return axiosClient.post<LoginResponse>("/admin-login", data);
};

export interface DashboardStats {
  totalUsers: number;
  totalTracks: number;
  pendingReports: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>(`${ADMIN_BASE_URL}/stats`);
  return response.data;
};
