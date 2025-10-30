import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchDashboardStatistics } from '@/features/statistics/statisticsSlice';
import AdminLayout from '@/components/layout/AdminLayout';
import Loading from '@/components/common/Loading';
import Badge from '@/components/common/Badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { getOrderStatusColor, getOrderStatusText } from '@/utils/helpers';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: statistics, isLoading } = useSelector(
    (state: RootState) => state.statistics
  );

  useEffect(() => {
    dispatch(fetchDashboardStatistics());
  }, [dispatch]);

  if (isLoading || !statistics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loading size="lg" text="Đang tải thống kê..." />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Doanh thu tháng này',
      value: formatCurrency(statistics.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Tổng đơn hàng',
      value: statistics.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Khách hàng',
      value: statistics.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Sản phẩm',
      value: statistics.totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const orderStats = [
    {
      label: 'Chờ xử lý',
      value: statistics.pendingOrders,
      status: 'PENDING',
    },
    {
      label: 'Đang giao',
      value: statistics.shippingOrders,
      status: 'SHIPPING',
    },
    {
      label: 'Hoàn thành',
      value: statistics.completedOrders,
      status: 'COMPLETED',
    },
    {
      label: 'Đã hủy',
      value: statistics.cancelledOrders,
      status: 'CANCELLED',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống quản lý bán hàng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={stat.textColor} size={24} />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Trạng thái đơn hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {orderStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <Badge variant={getOrderStatusColor(stat.status) as any}>
                  {getOrderStatusText(stat.status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary-600" size={24} />
            Sản phẩm bán chạy
          </h2>
          
          {statistics.topSellingProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Sản phẩm</th>
                    <th className="table-header-cell text-right">Số lượng đã bán</th>
                    <th className="table-header-cell text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {statistics.topSellingProducts.map((product) => (
                    <tr key={product.productId} className="table-row">
                      <td className="table-cell font-medium">{product.productName}</td>
                      <td className="table-cell text-right">
                        {product.totalQuantitySold.toLocaleString()}
                      </td>
                      <td className="table-cell text-right font-semibold text-primary-600">
                        {formatCurrency(product.totalRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Revenue by Date */}
        {Object.keys(statistics.revenueByDate || {}).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Doanh thu theo ngày</h2>
            <div className="space-y-3">
              {Object.entries(statistics.revenueByDate)
                .slice(-7)
                .map(([date, revenue]) => (
                  <div key={date} className="flex items-center justify-between">
                    <span className="text-gray-600">{date}</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(revenue)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;