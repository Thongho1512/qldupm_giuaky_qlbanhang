// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Pagination Response
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Pagination Request Params
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  keyword?: string; // Thêm keyword vào đây
}

// Search Params
export interface SearchParams extends PaginationParams {
  keyword?: string; // Đã có từ PaginationParams nhưng vẫn giữ để rõ ràng
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
  data: null | Record<string, string>; // For validation errors
  timestamp: string;
}