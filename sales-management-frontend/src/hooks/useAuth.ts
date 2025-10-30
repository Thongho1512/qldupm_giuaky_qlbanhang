import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

/**
 * Custom hook for accessing auth state
 * @returns Auth state and helper functions
 */
export const useAuth = () => {
  const { user, accessToken, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Tính toán isAdmin từ user.role thay vì lưu trong state
  const isAdmin = user?.role === 'ADMIN';
  const isCustomer = user?.role === 'CUSTOMER';

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    isCustomer,
  };
};