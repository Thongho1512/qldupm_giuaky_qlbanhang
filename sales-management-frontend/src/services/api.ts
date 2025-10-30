import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Track errors to prevent duplicate toasts
let lastErrorMessage = '';
let lastErrorTime = 0;

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors - with debouncing to prevent spam
    if (error.response) {
      const message = (error.response?.data as any)?.message || 'Có lỗi xảy ra!';
      const now = Date.now();
      
      // Only show toast if it's a different message or more than 3 seconds since last error
      if (message !== lastErrorMessage || now - lastErrorTime > 3000) {
        if (error.response.status !== 401) {
          toast.error(message);
        }
        lastErrorMessage = message;
        lastErrorTime = now;
      }
    } else if (error.request) {
      const now = Date.now();
      const message = 'Không thể kết nối đến server!';
      
      if (message !== lastErrorMessage || now - lastErrorTime > 3000) {
        toast.error(message);
        lastErrorMessage = message;
        lastErrorTime = now;
      }
    }

    return Promise.reject(error);
  }
);

export default api;