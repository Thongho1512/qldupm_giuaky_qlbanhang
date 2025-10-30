// src/features/user/userAPI.ts
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { User } from '@/types/auth.types';
import { UserRequest } from '@/types/user.types';
import { ApiResponse, PageResponse, SearchParams } from '@/types/api.types';

/**
 * Get all users (admin)
 */
export const getAllUsersAPI = async (
  params: SearchParams
): Promise<PageResponse<User>> => {
  const { keyword, ...paginationParams } = params;
  
  // Nếu có keyword, dùng endpoint search
  const endpoint = keyword 
    ? API_ENDPOINTS.USERS.ADMIN_SEARCH 
    : API_ENDPOINTS.USERS.ADMIN_ALL;
  
  const response = await api.get<ApiResponse<PageResponse<User>>>(
    endpoint,
    { params: keyword ? { keyword, ...paginationParams } : paginationParams }
  );
  return response.data.data;
};

/**
 * Get user by ID
 */
export const getUserByIdAPI = async (id: number): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(
    API_ENDPOINTS.USERS.BY_ID(id)
  );
  return response.data.data;
};

/**
 * Create user (admin)
 */
export const createUserAPI = async (data: UserRequest): Promise<User> => {
  const response = await api.post<ApiResponse<User>>(
    API_ENDPOINTS.USERS.ADMIN_CREATE,
    data
  );
  return response.data.data;
};

/**
 * Update user (admin)
 */
export const updateUserAPI = async (
  id: number,
  data: Partial<UserRequest>
): Promise<User> => {
  const response = await api.put<ApiResponse<User>>(
    API_ENDPOINTS.USERS.ADMIN_UPDATE(id),
    data
  );
  return response.data.data;
};

/**
 * Update user status (admin)
 */
export const updateUserStatusAPI = async (
  id: number,
  status: string
): Promise<User> => {
  const response = await api.put<ApiResponse<User>>(
    API_ENDPOINTS.USERS.ADMIN_UPDATE_STATUS(id),
    null,
    { params: { status } }
  );
  return response.data.data;
};

/**
 * Delete user (admin)
 */
export const deleteUserAPI = async (id: number): Promise<void> => {
  await api.delete(API_ENDPOINTS.USERS.ADMIN_DELETE(id));
};