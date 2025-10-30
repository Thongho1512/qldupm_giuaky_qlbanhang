import clsx, { ClassValue } from 'clsx';

/**
 * Merge class names
 * @param classes - Class names
 * @returns Merged class names
 */
export const cn = (...classes: ClassValue[]): string => {
  return clsx(classes);
};

/**
 * Truncate text
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Get order status badge color
 * @param status - Order status
 * @returns Badge color class
 */
export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'badge-warning';
    case 'SHIPPING':
      return 'badge-info';
    case 'COMPLETED':
      return 'badge-success';
    case 'CANCELLED':
      return 'badge-danger';
    default:
      return 'badge-gray';
  }
};

/**
 * Get order status text
 * @param status - Order status
 * @returns Status text in Vietnamese
 */
export const getOrderStatusText = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'Chờ xử lý';
    case 'SHIPPING':
      return 'Đang giao';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return status;
  }
};

/**
 * Get product status badge color
 * @param status - Product status
 * @returns Badge color class
 */
export const getProductStatusColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'badge-success';
    case 'INACTIVE':
      return 'badge-gray';
    case 'OUT_OF_STOCK':
      return 'badge-danger';
    default:
      return 'badge-gray';
  }
};

/**
 * Get product status text
 * @param status - Product status
 * @returns Status text in Vietnamese
 */
export const getProductStatusText = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Đang bán';
    case 'INACTIVE':
      return 'Ngừng bán';
    case 'OUT_OF_STOCK':
      return 'Hết hàng';
    default:
      return status;
  }
};

/**
 * Get user status badge color
 * @param status - User status
 * @returns Badge color class
 */
export const getUserStatusColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'badge-success';
    case 'INACTIVE':
      return 'badge-gray';
    case 'BANNED':
      return 'badge-danger';
    default:
      return 'badge-gray';
  }
};

/**
 * Get user status text
 * @param status - User status
 * @returns Status text in Vietnamese
 */
export const getUserStatusText = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Hoạt động';
    case 'INACTIVE':
      return 'Không hoạt động';
    case 'BANNED':
      return 'Bị khóa';
    default:
      return status;
  }
};

/**
 * Get user role text
 * @param role - User role
 * @returns Role text in Vietnamese
 */
export const getUserRoleText = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'Quản trị viên';
    case 'CUSTOMER':
      return 'Khách hàng';
    default:
      return role;
  }
};

/**
 * Sleep function for delay
 * @param ms - Milliseconds to sleep
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate random ID
 * @returns Random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Debounce function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};