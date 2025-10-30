// App Constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Cửa Hàng Thời Trang';
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Hệ thống quản lý bán hàng thời trang';

// Pagination
export const DEFAULT_PAGE_SIZE = Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 12;
export const ADMIN_PAGE_SIZE = Number(import.meta.env.VITE_ADMIN_PAGE_SIZE) || 10;

// File Upload
export const MAX_FILE_SIZE = Number(import.meta.env.VITE_UPLOAD_MAX_SIZE) || 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// LocalStorage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  CART: 'cart',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  SHIPPING: 'SHIPPING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const;

// User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BANNED: 'BANNED',
} as const;

// User Role
export const USER_ROLE = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
} as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)' },
  
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'createdAt-DESC', label: 'Mới nhất' },
  { value: 'createdAt-ASC', label: 'Cũ nhất' },
  { value: 'price-ASC', label: 'Giá thấp đến cao' },
  { value: 'price-DESC', label: 'Giá cao đến thấp' },
  { value: 'name-ASC', label: 'Tên A-Z' },
  { value: 'name-DESC', label: 'Tên Z-A' },
];

// Price Ranges
export const PRICE_RANGES = [
  { min: 0, max: 100000, label: 'Dưới 100.000đ' },
  { min: 100000, max: 300000, label: '100.000đ - 300.000đ' },
  { min: 300000, max: 500000, label: '300.000đ - 500.000đ' },
  { min: 500000, max: 1000000, label: '500.000đ - 1.000.000đ' },
  { min: 1000000, max: Infinity, label: 'Trên 1.000.000đ' },
];

// Routes
export const ROUTES = {
  // Customer routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_HISTORY: '/orders',
  ORDER_DETAIL: '/orders/:id',
  TRACK_ORDER: '/track-order',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_STATISTICS: '/admin/statistics',
};