// src/services/apiEndpoints.ts
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout',
  },

  // Users
  USERS: {
    ME: '/api/users/me',
    BY_ID: (id: number) => `/api/users/${id}`,
    ADMIN_ALL: '/api/admin/users',
    ADMIN_SEARCH: '/api/admin/users/search',
    ADMIN_UPDATE_STATUS: (id: number) => `/api/admin/users/${id}/status`,
    ADMIN_DELETE: (id: number) => `/api/admin/users/${id}`,
    ADMIN_CREATE: '/api/admin/users',
    ADMIN_UPDATE: (id: number) => `/api/admin/users/${id}`,
  },

  // Products
  PRODUCTS: {
    LIST: '/api/products',
    BY_ID: (id: number) => `/api/products/${id}`,
    BY_CATEGORY: (categoryId: number) => `/api/products/category/${categoryId}`,
    LATEST: '/api/products/latest',
    UPLOAD_IMAGE: '/api/products/upload-image',
    ADMIN_ALL: '/api/products',
    ADMIN_CREATE: '/api/products',
    ADMIN_UPDATE: (id: number) => `/api/products/${id}`,
    ADMIN_DELETE: (id: number) => `/api/products/${id}`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/api/categories',
    BY_ID: (id: number) => `/api/categories/${id}`,
    CREATE: '/api/categories',
    UPDATE: (id: number) => `/api/categories/${id}`,
    DELETE: (id: number) => `/api/categories/${id}`,
  },

  // Orders
  ORDERS: {
    CREATE: '/api/orders',
    MY_ORDERS: '/api/orders/my-orders',
    BY_ID: (id: number) => `/api/orders/${id}`,
    CANCEL: (id: number) => `/api/orders/${id}/cancel`,
    ADMIN_ALL: '/api/admin/orders',
    ADMIN_BY_STATUS: (status: string) => `/api/admin/orders/status/${status}`,
    ADMIN_SEARCH: '/api/admin/orders/search',
    ADMIN_UPDATE_STATUS: (id: number) => `/api/admin/orders/${id}/status`,
  },

  // Statistics
  STATISTICS: {
    DASHBOARD: '/api/statistics/dashboard',
    DATE_RANGE: '/api/statistics/date-range',
  },
};

export default API_ENDPOINTS;