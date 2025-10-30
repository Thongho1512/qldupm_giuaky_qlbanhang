import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { Category, CategoryRequest } from '@/types/category.types';
import { ApiResponse } from '@/types/api.types';

/**
 * Get all categories
 */
export const getAllCategoriesAPI = async (): Promise<Category[]> => {
  const response = await api.get<ApiResponse<Category[]>>(
    API_ENDPOINTS.CATEGORIES.LIST
  );
  return response.data.data;
};

/**
 * Get category by ID
 */
export const getCategoryByIdAPI = async (id: number): Promise<Category> => {
  const response = await api.get<ApiResponse<Category>>(
    API_ENDPOINTS.CATEGORIES.BY_ID(id)
  );
  return response.data.data;
};

/**
 * Create category (admin)
 */
export const createCategoryAPI = async (data: CategoryRequest): Promise<Category> => {
  const response = await api.post<ApiResponse<Category>>(
    API_ENDPOINTS.CATEGORIES.CREATE,
    data
  );
  return response.data.data;
};

/**
 * Update category (admin)
 */
export const updateCategoryAPI = async (
  id: number,
  data: CategoryRequest
): Promise<Category> => {
  const response = await api.put<ApiResponse<Category>>(
    API_ENDPOINTS.CATEGORIES.UPDATE(id),
    data
  );
  return response.data.data;
};

/**
 * Delete category (admin)
 */
export const deleteCategoryAPI = async (id: number): Promise<void> => {
  await api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
};