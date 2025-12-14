export interface PaginationParams {
  page?: number | string | string[];
  limit?: number;
  search?: string;
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}