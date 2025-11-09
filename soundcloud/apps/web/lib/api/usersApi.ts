import { PaginatedResult } from "@/types/common";
import { User } from "@repo/database";
import axiosClient from "./apiClient";
import { PaginationParams } from "@/type/PaginationParams";

type CreateUserPayload = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "emailVerified"
> & {
  password: string;
};

type UpdateUserPayload = Partial<User>;

const userApi = {
  getUsers: (params: PaginationParams = {}) => {
    return axiosClient.get<PaginatedResult<User>>("/users", {
      params: params,
    });
  },

  getUserById: (id: string) => axiosClient.get<User>(`/users/${id}`),

  createUser: (data: CreateUserPayload) =>
    axiosClient.post<User>("/users", data),

  updateUser: (id: string, data: UpdateUserPayload) =>
    axiosClient.patch<User>(`/users/${id}`, data),

  deleteUser: (id: string) => axiosClient.delete<void>(`/users/${id}`),

  checkEmail: (email: string) =>
    axiosClient.get<{ method: string }>("/users/check-email", {
      params: { email },
    }),
};

export default userApi;
