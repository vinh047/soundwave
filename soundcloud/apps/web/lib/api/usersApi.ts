import { PaginatedResult } from "@/types/common";
import { Prisma, User } from "@repo/database";
import axiosClient from "./apiClient";
import { PaginationParams } from "@/type/PaginationParams";

export type ArtistProfileData = Prisma.UserGetPayload<{
  select: {
    _count: {
      select: {
        tracks: true;
        likes: true;
        comments: true;
        following: true;
        followers: true;
      };
    };
  };
  include: {
    profile: {
      include: {
        websiteProfiles: {
          include: {
            websiteType: true;
          };
        };
      };
    };

    tracks: {
      include: {
        user: true;
        likes: true;
        reposts: true;
      };
    };

    playlists: {
      orderBy: { createdAt: "desc" };
      take: 3;
      select: {
        id: true;
        title: true;
        isPublic: true;
        tracks: { select: { track: { select: { imagePath: true } } } };
      };
    };
  };
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

  getArtistProfileData: (id: string) =>
    axiosClient.get<ArtistProfileData>(`/users/${id}/profile-data`),

  getAllTracksByUserId: (id: string) =>
    axiosClient.get<{
      data: Prisma.TrackGetPayload<{
        include: { user: true; likes: true; reposts: true };
      }>[];
    }>(`/users/${id}/tracks`),

  getAllPlaylistsByUserId: (id: string) =>
    axiosClient.get<{
      data: Prisma.PlaylistGetPayload<{
        include: { tracks: { include: { track: true } } };
      }>[];
    }>(`/users/${id}/playlists`),

  getAllRepostsByUserId: (id: string) =>
    axiosClient.get<{
      data: Prisma.RepostGetPayload<{
        include: {
          track: { include: { user: true; likes: true; comments: true } };
        };
      }>[];
    }>(`/users/${id}/reposts`),

  getPopularTracksByUserId: (id: string) =>
    axiosClient.get<{
      data: Prisma.TrackGetPayload<{
        include: { user: true; likes: true };
      }>[];
    }>(`/users/${id}/popular-tracks`),

  getFollowersByUserId: (id: string) =>
    axiosClient.get<{
      data: Prisma.FollowGetPayload<{
        include: { follower: true };
      }>[];
    }>(`/users/${id}/followers`),

  getFollowingByUserId: (id: string) =>
    axiosClient.get<{
      data: Prisma.FollowGetPayload<{
        include: { following: true };
      }>[];
    }>(`/users/${id}/following`),

  getLikesByUserId: (id: string) =>
    axiosClient.get<{
      data: Prisma.LikeGetPayload<{
        include: {
          track: { include: { user: true; likes: true } };
        };
      }>[];
    }>(`/users/${id}/likes`),

  createUser: (
    data: Omit<
      User,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "emailVerified"
      | "hashedRefreshToken"
      | "image"
    > & {
      password: string;
      image?: string;
    }
  ) => axiosClient.post<User>("/users", data),

  updateUser: (id: string, data: FormData) =>
    axiosClient.patch<User>(`/users/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

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

  searchUsers: (params: PaginationParams & { q: string }) => {
    return axiosClient.get("/users/search", {
      params: {
        q: params.q,
        page: params.page,
        limit: params.limit,
      },
    });
  },
};

export default userApi;
