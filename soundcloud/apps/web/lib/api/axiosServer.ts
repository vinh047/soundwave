import axios from "axios";
import { cookies } from "next/headers";

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosServer.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    if (accessToken) {
      config.headers.Cookie = `access_token=${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosServer;
