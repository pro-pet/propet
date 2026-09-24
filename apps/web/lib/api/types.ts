export interface PaginationParams {
  pageIndex?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  items: T[]
  meta: {
    total: number
    pageIndex: number
    pageSize: number
    totalPages: number
  }
}
