// ../../packages/types/common.ts

/**
 * Interface chuẩn cho kết quả phân trang (Pagination Result)
 * @template T - Kiểu dữ liệu của các mục trong danh sách (ví dụ: UserType, TrackType)
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
