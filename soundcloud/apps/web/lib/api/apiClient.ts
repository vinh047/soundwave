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

    // ⚠️ QUAN TRỌNG: Kiểm tra xem URL bị lỗi có phải là endpoint refresh không
    // Nếu chính là '/auth/refresh' đang bị lỗi 401 thì DỪNG LẠI NGAY (tránh loop)
    if (originalRequest.url?.includes("/auth/refresh")) {
      // Có thể force logout tại đây nếu muốn
      // window.location.href = '/login';
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosClient.post("/auth/refresh");
        // Gọi lại request gốc
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        // Nếu refresh thất bại thì reject luôn, không retry nữa
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;