export interface IPaginationFilter {
  limit?: string;
  page?: string;
  country?: string
}

export interface PaginatedDocument<T> {
  totalCount: number;
  data: T;
}
