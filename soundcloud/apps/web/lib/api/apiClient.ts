import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import queryString from "query-string";

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  paramsSerializer: (params) => {
    return queryString.stringify(params);
  },
});

// --- Request Interceptor ---
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      return Promise.reject(error);
    }
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else {
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
