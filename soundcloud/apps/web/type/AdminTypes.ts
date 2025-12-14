// web/type/AdminTypes.ts

import { PaginationParams } from './PaginationParams'; // Import PaginationParams
import { PaginatedResult } from './PaginationParams'; // Giả định PaginatedResult cũng được export từ đây

// --- 1. ENUM VÀ DTO CHO HÀNH ĐỘNG XỬ LÝ ---

/**
 * Các hành động xử lý báo cáo (Phải khớp với BE: AdminReportAction)
 */
export enum AdminReportAction {
  DELETE_TRACK = 'DELETE_TRACK',      // Cấm bài hát (Track.isBanned = true)
  DISMISS_REPORT = 'DISMISS_REPORT',  // Bỏ qua báo cáo (Xóa Report)
}

/**
 * Payload (Dữ liệu gửi đi) khi Admin thực hiện hành động xử lý báo cáo.
 */
export interface UpdateReportActionPayload {
  action: AdminReportAction;
}

/**
 * Payload (Dữ liệu gửi đi) khi Admin cập nhật trạng thái Track
 */
export interface UpdateTrackStatusPayload {
  isBanned: boolean;
}

/**
 * Payload (Dữ liệu gửi đi) khi Admin cập nhật trạng thái User (KHÔNG SỬ DỤNG ĐƯỢC do BE bị hạn chế)
 */
export interface UpdateUserStatusPayload {
  isBanned: boolean; 
}


// --- 2. TYPES DỮ LIỆU TRẢ VỀ TỪ BE ---

/**
 * Interface cho dữ liệu User khi lấy danh sách (GET /admin/users)
 */
export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  role: 'USER' | 'ADMIN';
  profile: { isArtist: boolean } | null;
}
export type AdminUserList = PaginatedResult<AdminUser>;


/**
 * Interface cho dữ liệu Report khi lấy danh sách (GET /admin/reports)
 */
export interface ReportItem {
  id: string;
  message: string | null;
  createdAt: string;
  
  // Thông tin lý do
  reportReason: { reason: string };
  
  // Thông tin người báo cáo
  reporter: { id: string, email: string, name: string | null };
  
  // Thông tin bài hát bị báo cáo (BAO GỒM isBanned)
  track: { 
      id: string, 
      title: string, 
      userId: string, 
      isBanned: boolean;
  };
}


/**
 * Interface cho dữ liệu Track khi lấy danh sách (GET /admin/tracks)
 */
export interface AdminTrack {
  id: string;
  title: string;
  isBanned: boolean;
  isPublic: boolean;
  playCount: number;
  createdAt: string;
  user: { id: string, email: string, name: string | null };
}
export type AdminTrackList = PaginatedResult<AdminTrack>;