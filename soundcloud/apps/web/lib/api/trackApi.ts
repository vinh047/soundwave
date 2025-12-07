import { PaginatedResult } from "@/types/common";
import { Prisma, Track, Track as TrackType, User } from "@repo/database";
import axiosClient from "./apiClient";
import { PaginationParams } from "@/type/PaginationParams";

type CreateTrackPayload = Omit<
  TrackType,
  "id" | "createdAt" | "updatedAt" | "userId" | "playCount" | "isBanned"
> & {};

type UpdateTrackPayload = Partial<CreateTrackPayload>;

const trackApi = {
  getTracks: (params: PaginationParams = {}) => {
    return axiosClient.get<
      PaginatedResult<Prisma.TrackGetPayload<{ include: { user: true } }>>
    >("/tracks", {
      params,
    });
  },

  getTrackById: (id: string) =>
    axiosClient.get<
      Prisma.TrackGetPayload<{
        include: {
          user: true;
          likes: true;
          reposts: true;
          comments: { include: { user: true } };
        };
      }>
    >(`/tracks/${id}`),

  uploadTrack: (data: FormData) =>
    axiosClient.post<TrackType>("/tracks", data, {
      headers: {
        "Content-Type": "multipart/form-data", // Quan trọng khi upload file
      },
    }),

  updateTrack: (id: string, data: UpdateTrackPayload) =>
    axiosClient.patch<TrackType>(`/tracks/${id}`, data),

  deleteTrack: (id: string) => axiosClient.delete<void>(`/tracks/${id}`),

  getTrendingTracks: (limit: number) =>
    axiosClient.get<
      Prisma.TrackGetPayload<{
        include: {
          user: true;
          _count: {
            select: {
              likes: true;
              reposts: true;
              comments: true;
            };
          };
        };
      }>[]
    >(`/tracks/trending?limit=${limit}`),

  getRecentTracks: () =>
    axiosClient.get<Prisma.TrackGetPayload<{ include: { user: true } }>[]>(
      `/tracks/recent`
    ),

  // --- SOCIAL ---
  likeTrack: (id: string) => axiosClient.post(`/tracks/${id}/like`),
  unlikeTrack: (id: string) => axiosClient.delete(`/tracks/${id}/like`),

  repostTrack: (id: string) => axiosClient.post(`/tracks/${id}/repost`),
  unrepostTrack: (id: string) => axiosClient.delete(`/tracks/${id}/repost`),

  commentTrack: (id: string, content: string) =>
    axiosClient.post(`/tracks/${id}/comments`, { content }),
  getComments: (id: string) =>
    axiosClient.get<Prisma.CommentGetPayload<{ include: { user: true } }>[]>(
      `/tracks/${id}/comments`
    ),
  increasePlayCount: (id: string) =>
    axiosClient.post<{ message: string }>(`/tracks/${id}/listen`),
};

export default trackApi;
