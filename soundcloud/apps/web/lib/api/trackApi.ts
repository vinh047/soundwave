import { PaginatedResult } from "@/types/common";
import { Prisma, Track as TrackType } from "@repo/database";
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
        "Content-Type": "multipart/form-data",
      },
    }),

  updateTrack: (id: string, data: UpdateTrackPayload) =>
    axiosClient.patch<TrackType>(`/tracks/${id}`, data),

  updateTrackByOwner(trackId: string, data: FormData) {
    return axiosClient.patch(`/tracks/${trackId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getTracksByUserId: (userId: string) =>
    axiosClient.get< Prisma.TrackGetPayload<{
    include: {
      user: true;
      likes: true;
      reposts: true;
      _count: {
        select: { likes: true; reposts: true; comments: true };
      };
    };
  }>[]>(`tracks/user/${userId}`),

  updateTrackWithImage: (id: string, data: FormData) =>
    axiosClient.patch<TrackType>(`/tracks/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

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

  searchEverything: (params: PaginationParams & { q: string }) => {
    return axiosClient.get<
      PaginatedResult<
        Prisma.TrackGetPayload<{
          include: {
            user: true;
            likes: true;
            reposts: true;
            _count: {
              select: {
                likes: true;
                reposts: true;
                comments: true;
              };
            };
          };
        }>
      >
    >("/tracks/search/everything", {
      params: {
        page: params.page,
        limit: params.limit,
        q: params.q,
      },
    });
  },

  checkLike: (id: string) => {
    return axiosClient.get<{ isLiked: boolean }>(`/tracks/${id}/check-like`);
  },
};

export default trackApi;
