// src/features/order/orderAPI.ts
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { Order, OrderRequest, UpdateOrderStatusRequest, GuestOrderRequest } from '@/types/order.types';
import { ApiResponse, PageResponse, PaginationParams } from '@/types/api.types';

/**
 * Create order
 */
export const createOrderAPI = async (data: OrderRequest): Promise<Order> => {
  const response = await api.post<ApiResponse<Order>>(
    API_ENDPOINTS.ORDERS.CREATE,
    data
  );
  return response.data.data;
};

/**
 * Get my orders
 */
export const getMyOrdersAPI = async (
  params: PaginationParams
): Promise<PageResponse<Order>> => {
  const response = await api.get<ApiResponse<PageResponse<Order>>>(
    API_ENDPOINTS.ORDERS.MY_ORDERS,
    { params }
  );
  return response.data.data;
};

/**
 * Get order by ID
 */
export const getOrderByIdAPI = async (id: number): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(
    API_ENDPOINTS.ORDERS.BY_ID(id)
  );
  return response.data.data;
};

/**
 * Cancel order
 */
export const cancelOrderAPI = async (id: number): Promise<void> => {
  await api.put(API_ENDPOINTS.ORDERS.CANCEL(id));
};

/**
 * Get all orders (admin)
 */
export const getAllOrdersAPI = async (
  params: PaginationParams & { keyword?: string }
): Promise<PageResponse<Order>> => {
  const { keyword, ...paginationParams } = params;
  
  // Nếu có keyword, dùng endpoint search
  const endpoint = keyword 
    ? API_ENDPOINTS.ORDERS.ADMIN_SEARCH 
    : API_ENDPOINTS.ORDERS.ADMIN_ALL;
  
  const response = await api.get<ApiResponse<PageResponse<Order>>>(
    endpoint,
    { params: keyword ? { keyword, ...paginationParams } : paginationParams }
  );
  return response.data.data;
};

/**
 * Get orders by status (admin)
 */
export const getOrdersByStatusAPI = async (
  status: string,
  params: PaginationParams
): Promise<PageResponse<Order>> => {
  const response = await api.get<ApiResponse<PageResponse<Order>>>(
    API_ENDPOINTS.ORDERS.ADMIN_BY_STATUS(status),
    { params }
  );
  return response.data.data;
};

/**
 * Update order status (admin)
 */
export const updateOrderStatusAPI = async (
  id: number,
  data: UpdateOrderStatusRequest
): Promise<Order> => {
  const response = await api.put<ApiResponse<Order>>(
    API_ENDPOINTS.ORDERS.ADMIN_UPDATE_STATUS(id),
    data
  );
  return response.data.data;
};

export const createGuestOrderAPI = async (data: GuestOrderRequest): Promise<Order> =>{
  const response = await api.post<ApiResponse<Order>>(
    '/api/orders/guest',
    data
  );
  return response.data.data;
}