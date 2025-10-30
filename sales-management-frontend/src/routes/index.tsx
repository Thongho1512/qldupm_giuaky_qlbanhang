import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '@/utils/constants';

// Customer Pages
import HomePage from '@/pages/customer/HomePage';
import LoginPage from '@/pages/customer/LoginPage';
import RegisterPage from '@/pages/customer/RegisterPage';
import ProductListPage from '@/pages/customer/ProductListPage';
import ProductDetailPage from '@/pages/customer/ProductDetailPage';
import CartPage from '@/pages/customer/CartPage';
import CheckoutPage from '@/pages/customer/CheckoutPage';
import OrderHistoryPage from '@/pages/customer/OrderHistoryPage';
import TrackOrderPage from '@/pages/customer/TrackOrderPage';

// Admin Pages
import DashboardPage from '@/pages/admin/DashboardPage';
import ProductManagementPage from '@/pages/admin/ProductManagementPage';
import CategoryManagementPage from '@/pages/admin/CategoryManagementPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import OrderManagementPage from '@/pages/admin/OrderManagementPage';
import StatisticsPage from '@/pages/admin/StatisticsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.PRODUCTS} element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path={ROUTES.CHECKOUT} element={ <CheckoutPage /> } />      
      <Route path={ROUTES.CART} element={ <CartPage /> } />
      <Route path={ROUTES.TRACK_ORDER} element={<TrackOrderPage />} />


      {/* Protected Admin Routes */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedRoute requireAdmin>
            <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ORDER_HISTORY}
        element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute requireAdmin>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_PRODUCTS}
        element={
          <ProtectedRoute requireAdmin>
            <ProductManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_CATEGORIES}
        element={
          <ProtectedRoute requireAdmin>
            <CategoryManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_USERS}
        element={
          <ProtectedRoute requireAdmin>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_ORDERS}
        element={
          <ProtectedRoute requireAdmin>
            <OrderManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_STATISTICS}
        element={
          <ProtectedRoute requireAdmin>
            <StatisticsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;