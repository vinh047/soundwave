import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import queryString from "query-string";

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // QUAN TRỌNG: Để cookie tự động gửi đi
  paramsSerializer: (params) => {
    return queryString.stringify(params);
  },
});

// --- Request Interceptor ---
// (Đã xóa logic lấy token từ localStorage)
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Không cần làm gì ở đây cả vì Cookie tự động được browser gửi đi
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) return Promise.reject(error);

    // 1. Chặn loop vô hạn ở endpoint refresh (Code cũ của bạn)
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // 🔥 2. THÊM ĐOẠN NÀY: Chặn refresh khi đang Đăng nhập 🔥
    // Nếu API bị lỗi có chứa chữ "login" (ví dụ: /auth/login, /admin/login)
    // Thì đây là lỗi sai mật khẩu -> Trả lỗi luôn (reject), không đi refresh token.
    if (originalRequest.url?.includes("login")) {
      return Promise.reject(error);
    }

    // 3. Logic Refresh Token (Chỉ chạy khi token hết hạn ở các request lấy dữ liệu bình thường)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosClient.post("/auth/refresh");
        // Gọi lại request gốc sau khi refresh thành công
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        // Nếu refresh thất bại thì reject luôn
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
