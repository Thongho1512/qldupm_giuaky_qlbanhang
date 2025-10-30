import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { Product, ProductRequest } from '@/types/product.types';
import { ApiResponse, PageResponse, PaginationParams } from '@/types/api.types';

/**
 * Get all active products (customer view)
 */
export const getActiveProductsAPI = async (
  params: PaginationParams & { keyword?: string }
): Promise<PageResponse<Product>> => {
  const response = await api.get<ApiResponse<PageResponse<Product>>>(
    API_ENDPOINTS.PRODUCTS.LIST,
    { params }
  );
  return response.data.data;
};

/**
 * Get all products (admin view)
 */
export const getAllProductsAPI = async (
  params: PaginationParams
): Promise<PageResponse<Product>> => {
  const response = await api.get<ApiResponse<PageResponse<Product>>>(
    API_ENDPOINTS.PRODUCTS.ADMIN_ALL,
    { params }
  );
  return response.data.data;
};

/**
 * Get product by ID
 */
export const getProductByIdAPI = async (id: number): Promise<Product> => {
  const response = await api.get<ApiResponse<Product>>(
    API_ENDPOINTS.PRODUCTS.BY_ID(id)
  );
  return response.data.data;
};

/**
 * Get products by category
 */
export const getProductsByCategoryAPI = async (
  categoryId: number,
  params: PaginationParams
): Promise<PageResponse<Product>> => {
  const response = await api.get<ApiResponse<PageResponse<Product>>>(
    API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId),
    { params }
  );
  return response.data.data;
};

/**
 * Get latest products
 */
export const getLatestProductsAPI = async (limit: number = 8): Promise<Product[]> => {
  const response = await api.get<ApiResponse<Product[]>>(
    API_ENDPOINTS.PRODUCTS.LATEST,
    { params: { limit } }
  );
  return response.data.data;
};

/**
 * Create product (admin)
 */
export const createProductAPI = async (data: FormData): Promise<Product> => {
  const response = await api.post<ApiResponse<Product>>(
    API_ENDPOINTS.PRODUCTS.ADMIN_CREATE,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
};

/**
 * Update product (admin)
 */
export const updateProductAPI = async (
  id: number,
  data: FormData
): Promise<Product> => {
  const response = await api.put<ApiResponse<Product>>(
    API_ENDPOINTS.PRODUCTS.ADMIN_UPDATE(id),
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
};

/**
 * Delete product (admin)
 */
export const deleteProductAPI = async (id: number): Promise<void> => {
  await api.delete(API_ENDPOINTS.PRODUCTS.ADMIN_DELETE(id));
};

/**
 * Upload product image
 */
export const uploadProductImageAPI = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<ApiResponse<string>>(
    API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
};