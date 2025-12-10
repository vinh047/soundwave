import axiosClient from "./apiClient";
import { Prisma, WebsiteType as WebsiteTypeModel } from "@repo/database";
import { PaginatedResult } from "@/types/common";
import { PaginationParams } from "@/type/PaginationParams";

type CreateWebsiteTypePayload = Omit<
  WebsiteTypeModel,
  "id" | "websiteProfiles"
>;

type UpdateWebsiteTypePayload = Partial<CreateWebsiteTypePayload>;

const websiteTypeApi = {
  // Lấy danh sách WebsiteType (có phân trang)
  getWebsiteTypes: (params: PaginationParams = {}) => {
    return axiosClient.get<PaginatedResult<Prisma.WebsiteTypeGetPayload<{}>>>(
      "/website-types",
      {
        params,
      }
    );
  },

  // Lấy WebsiteType theo id
  getWebsiteTypeById: (id: string) =>
    axiosClient.get<Prisma.WebsiteTypeGetPayload<{}>>(`/website-types/${id}`),

  // Tạo mới WebsiteType
  createWebsiteType: (data: CreateWebsiteTypePayload) =>
    axiosClient.post<WebsiteTypeModel>("/website-types", data),

  // Cập nhật WebsiteType
  updateWebsiteType: (id: string, data: UpdateWebsiteTypePayload) =>
    axiosClient.patch<WebsiteTypeModel>(`/website-types/${id}`, data),

  // Xóa WebsiteType
  deleteWebsiteType: (id: string) =>
    axiosClient.delete<void>(`/website-types/${id}`),
};

export default websiteTypeApi;
