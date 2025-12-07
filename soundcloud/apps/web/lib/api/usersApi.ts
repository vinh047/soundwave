import { PaginatedResult } from "@/types/common";
import { Playlist, Prisma, User } from "@repo/database";
import axiosClient from "./apiClient";
import { PaginationParams } from "@/type/PaginationParams";

type CreateUserPayload = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "emailVerified"
> & {
  password: string;
};

type UpdateUserPayload = Partial<User>;

type RepostWithTrack = Prisma.RepostGetPayload<{
  include: { track: { include: { user: true } } };
}>;

type TrackWithUser = Prisma.TrackGetPayload<{
  include: { user: true };
}>;

const userApi = {
  getUsers: (params: PaginationParams = {}) => {
    return axiosClient.get<PaginatedResult<User>>("/users", {
      params: params,
    });
  },

  getUserById: (id: string) =>
    axiosClient.get<
      Prisma.UserGetPayload<{
        include: {
          tracks: {
            include: {
              user: true;
              likes: true;
              reposts: true;
              comments: true;
            };
          };
          playlists: {
            include: { tracks: true };
          };
          likes: true;
          reposts: true;
          reports: true;
          comments: true;
          following: true;
          followers: true;
          profile: {
            include: {
              websiteProfiles: true;
            };
          };
        };
      }>
    >(`/users/${id}`),

  getPlaylistsByUserId: (id: string) =>
    axiosClient.get<{ data: Playlist[] }>(`/users/${id}/playlists`),

  getRepostsByUserId: (id: string) =>
    axiosClient.get<{ data: RepostWithTrack[] }>(`/users/${id}/reposts`),

  getPopularTracksByUserId: (id: string) =>
    axiosClient.get<{ data: TrackWithUser[] }>(`/users/${id}/popular-tracks`),

  createUser: (data: CreateUserPayload) =>
    axiosClient.post<User>("/users", data),

  updateUser: (id: string, data: UpdateUserPayload) =>
    axiosClient.patch<User>(`/users/${id}`, data),

  deleteUser: (id: string) => axiosClient.delete<void>(`/users/${id}`),

  checkEmail: (email: string) =>
    axiosClient.get<{ method: string }>("/users/check-email", {
      params: { email },
    }),

  getTrendingArtists: (limit: number = 5) =>
    axiosClient.get<{ data: User[] }>(`/users/trending?limit=${limit}`),

  // --- SOCIAL ---
  followUser: (id: string) => axiosClient.post(`/users/${id}/follow`),
  unfollowUser: (id: string) => axiosClient.delete(`/users/${id}/follow`),
  checkFollow: (id: string) =>
    axiosClient.get<{ isFollowing: boolean }>(`/users/${id}/follow`),
};

export default userApi;
