import { PaginatedResult } from "@/types/common";
import { UserType } from "@repo/database";
import axiosClient from "./apiClient";
import { PaginationParams } from "@/type/PaginationParams";

type CreateUserPayload = Omit<
  UserType,
  "id" | "createdAt" | "updatedAt" | "emailVerified"
> & {
  password: string;
};

type UpdateUserPayload = Partial<UserType>;

const userApi = {
  getUsers: (params: PaginationParams = {}) => {
    return axiosClient.get<PaginatedResult<UserType>>("/users", {
      params: params,
    });
  },

  getUserById: (id: string) => axiosClient.get<UserType>(`/users/${id}`),

  createUser: (data: CreateUserPayload) =>
    axiosClient.post<UserType>("/users", data),

  updateUser: (id: string, data: UpdateUserPayload) =>
    axiosClient.patch<UserType>(`/users/${id}`, data),

  deleteUser: (id: string) => axiosClient.delete<void>(`/users/${id}`),
};

export default userApi;
