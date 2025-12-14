import axiosClient from "./apiClient";
import { PaginationParams } from "@/type/PaginationParams";
import { PaginatedResult } from "@/types/common";

const playlistApi = {
  searchPlaylists: (params: PaginationParams & { q: string }) => {
    return axiosClient.get<PaginatedResult<any>>("/playlists/search", {
      params: {
        q: params.q,
        page: params.page,
        limit: params.limit,
      },
    });
  },

  createPlaylist: (data: { title: string; isPublic?: boolean }) => {
    return axiosClient.post("/playlists", data);
  },

  getMyPlaylists: () => {
    return axiosClient.get("/playlists/me");
  },

  getPlaylistById: (id: string) => {
    return axiosClient.get(`/playlists/${id}`);
  },

  addTrackToPlaylist: (playlistId: string, trackId: string) => {
    return axiosClient.post(`/playlists/${playlistId}/tracks`, { trackId });
  },

  removeTrackFromPlaylist: (playlistId: string, trackId: string) => {
    return axiosClient.delete(`/playlists/${playlistId}/tracks/${trackId}`);
  },

  deletePlaylist: (id: string) => {
    return axiosClient.delete(`/playlists/${id}`);
  },

  updatePlaylist: (id: string, data: { title: string; isPublic?: boolean }) => {
    return axiosClient.patch(`/playlists/${id}`, data);
  },
};

export default playlistApi;