import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { Statistics, DateRangeRequest } from '@/types/statistics.types';
import { ApiResponse } from '@/types/api.types';

/**
 * Get dashboard statistics
 */
export const getDashboardStatisticsAPI = async (): Promise<Statistics> => {
  const response = await api.get<ApiResponse<Statistics>>(
    API_ENDPOINTS.STATISTICS.DASHBOARD
  );
  return response.data.data;
};

/**
 * Get statistics by date range
 */
export const getStatisticsByDateRangeAPI = async (
  params: DateRangeRequest
): Promise<Statistics> => {
  const response = await api.get<ApiResponse<Statistics>>(
    API_ENDPOINTS.STATISTICS.DATE_RANGE,
    { params }
  );
  return response.data.data;
};