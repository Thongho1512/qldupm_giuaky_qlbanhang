import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  User,
} from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';

/**
 * Login user
 */
export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    data
  );
  return response.data.data;
};

/**
 * Register new user
 */
export const registerAPI = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post<ApiResponse<User>>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );
  return response.data.data;
};

/**
 * Refresh access token
 */
export const refreshTokenAPI = async (
  data: RefreshTokenRequest
): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    data
  );
  return response.data.data;
};

/**
 * Logout user
 */
export const logoutAPI = async (): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.LOGOUT);
};

/**
 * Get current user info
 */
export const getCurrentUserAPI = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.USERS.ME);
  return response.data.data;
};