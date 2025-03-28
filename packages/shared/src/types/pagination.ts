export interface IPagination<T> {
  items: T;
  pageSize?: number;
  totalPages?: number;
  totalItems: number;
}
