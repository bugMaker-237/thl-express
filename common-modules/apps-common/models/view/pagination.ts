export interface IPagination {
  resultCount: number;
  currentPage: number;
  hasMorePages: boolean;
  nextPage: string;
  previousPage: string;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: IPagination;
}
