import axiosClient from "./apiClient";
// 💡 LƯU Ý: Import type User từ package database đã được cấu hình re-export
import type { User } from "@repo/database";

// --- 1. ĐỊNH NGHĨA TYPES (Sử dụng Omit thuần túy) ---

// Kiểu User trả về cho Frontend (loại bỏ các trường nhạy cảm)
export type PublicUser = Omit<
  User,
  | "hashedPassword"
  | "hashedRefreshToken"
  | "emailVerified"
  | "createdAt"
  | "updatedAt"
>;

// Kiểu cho Request Đăng ký/Xác thực
export interface AuthenticatePayload {
  email: string;
  password: string;
  name?: string; // Tùy chọn, dùng cho đăng ký
}

// Kiểu trả về cho Đăng nhập Thành công
export interface LoginSuccessResponse {
  user: PublicUser; // Trả về user đã được làm sạch
  accessToken: string;
  action: "LOGIN_SUCCESS";
}

// Kiểu trả về cho Đăng ký/Xác thực Email
export interface RegisterVerifyResponse {
  message: string;
  email: string;
  action: "VERIFY_REQUIRED";
}

// Kiểu trả về cho Endpoint /authenticate (Login HOẶC Register)
type AuthenticateResponse = LoginSuccessResponse | RegisterVerifyResponse;

// --- 2. HÀM API CHÍNH (authApi) ---

const authApi = {
  /**
   * POST /auth/authenticate
   * Xử lý Đăng nhập (nếu user tồn tại) HOẶC Đăng ký và Gửi link xác thực.
   * @param data Payload chứa email, password (và name nếu đăng ký).
   */
  authenticateOrRegister: (data: AuthenticatePayload) => {
    // Controller NestJS của bạn đang lắng nghe endpoint 'authenticate'
    return axiosClient.post<AuthenticateResponse>("/auth/authenticate", data);
  },

  /**
   * POST /auth/refresh
   * Sử dụng Refresh Token (tự động đính kèm qua HttpOnly Cookie) để lấy Access Token mới.
   */
  refresh: () => {
    return axiosClient.post<{ accessToken: string; user: PublicUser }>(
      "/auth/refresh"
    );
  },

  /**
   * GET /auth/profile
   * Lấy thông tin user hiện tại (Dùng để kiểm tra trạng thái login khi khởi động).
   */
  getProfile: () => {
    // API này yêu cầu Access Token trong header Authorization
    return axiosClient.get<PublicUser>("/auth/profile");
  },

  /**
   * POST /auth/logout
   * Yêu cầu Backend vô hiệu hóa Refresh Token Hash và xóa HttpOnly Cookie.
   */
  logout: () => {
    return axiosClient.post<void>("/auth/logout");
  },

  checkEmail: (email: string) => {
    return axiosClient.get<boolean>(`/auth/check-email/${email}`);
  },

  resendVerification: (payload: { email: string }) =>
    axiosClient.post("/auth/resend-verification", payload),
};

export default authApi;
