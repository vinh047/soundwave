import axiosClient from "./apiClient";
import { PaginationParams } from "@/type/PaginationParams"; 
import { PaginatedResult } from "@/types/common";

// Bạn có thể import type Playlist từ component hoặc định nghĩa ở đây để strict type
// interface Playlist { ... }

const playlistApi = {
  // Chỉ giữ lại hàm search
  searchPlaylists: (params: PaginationParams & { q: string }) => {
    return axiosClient.get<PaginatedResult<any>>("/playlists/search", {
      params: {
        q: params.q,
        page: params.page,
        limit: params.limit,
      },
    });
  },
};

export default playlistApi;