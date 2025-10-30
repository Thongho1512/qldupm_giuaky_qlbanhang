import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, TrendingUp, Download } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchDashboardStatistics, fetchStatisticsByDateRange } from '@/features/statistics/statisticsSlice';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Loading from '@/components/common/Loading';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const StatisticsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: statistics, isLoading } = useSelector((state: RootState) => state.statistics);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCustomRange, setIsCustomRange] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardStatistics());
  }, [dispatch]);

  const handleDateRangeFilter = () => {
    if (startDate && endDate) {
      dispatch(
        fetchStatisticsByDateRange({
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        })
      );
    }
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setIsCustomRange(false);
    dispatch(fetchDashboardStatistics());
  };

  if (isLoading || !statistics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loading size="lg" text="Đang tải thống kê..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thống kê & Báo cáo</h1>
            <p className="text-gray-600 mt-1">Phân tích dữ liệu kinh doanh chi tiết</p>
          </div>
          <Button leftIcon={<Download size={20} />} variant="outline">
            Xuất báo cáo
          </Button>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant={!isCustomRange ? 'primary' : 'outline'}
              onClick={handleResetFilter}
              leftIcon={<Calendar size={18} />}
            >
              Tháng này
            </Button>
            <Button
              variant={isCustomRange ? 'primary' : 'outline'}
              onClick={() => setIsCustomRange(true)}
              leftIcon={<Calendar size={18} />}
            >
              Tùy chỉnh
            </Button>

            {isCustomRange && (
              <>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-auto"
                />
                <span className="text-gray-500">đến</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-auto"
                />
                <Button onClick={handleDateRangeFilter}>Áp dụng</Button>
              </>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        {Object.keys(statistics.revenueByDate || {}).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-primary-600" size={24} />
              Doanh thu theo ngày
            </h2>
            
            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {Object.entries(statistics.revenueByDate)
                .slice(-14)
                .map(([date, revenue]) => {
                  const maxRevenue = Math.max(...Object.values(statistics.revenueByDate));
                  const percentage = (revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={date} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-600">{date}</div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-8 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage > 20 && (
                              <span className="text-white text-sm font-semibold">
                                {formatCurrency(revenue)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {percentage <= 20 && (
                        <div className="w-32 text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(revenue)}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top sản phẩm bán chạy</h2>
          
          {statistics.topSellingProducts.length > 0 ? (
            <div className="space-y-4">
              {statistics.topSellingProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Đã bán: {product.totalQuantitySold.toLocaleString()} sản phẩm
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                    <p className="text-sm text-gray-500">Doanh thu</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tổng doanh thu</h3>
            <p className="text-3xl font-bold text-primary-600">
              {formatCurrency(statistics.totalRevenue)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Từ {statistics.completedOrders + statistics.shippingOrders} đơn hàng
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Trung bình đơn hàng</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                statistics.totalOrders > 0
                  ? statistics.totalRevenue / (statistics.completedOrders + statistics.shippingOrders)
                  : 0
              )}
            </p>
            <p className="text-sm text-gray-500 mt-2">Giá trị trung bình</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tỷ lệ hoàn thành</h3>
            <p className="text-3xl font-bold text-green-600">
              {statistics.totalOrders > 0
                ? ((statistics.completedOrders / statistics.totalOrders) * 100).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {statistics.completedOrders} / {statistics.totalOrders} đơn
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatisticsPage;