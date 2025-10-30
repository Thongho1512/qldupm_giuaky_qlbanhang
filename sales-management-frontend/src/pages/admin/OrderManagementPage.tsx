import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Filter } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchAllOrders, updateOrderStatus } from '@/features/order/orderSlice';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import Pagination from '@/components/common/Pagination';
import SearchBar from '@/components/common/SearchBar';
import Badge from '@/components/common/Badge';
import { TableRowSkeleton } from '@/components/common/Loading';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { getOrderStatusColor, getOrderStatusText } from '@/utils/helpers';
import { Order } from '@/types/order.types';
import { ORDER_STATUS } from '@/utils/constants';
import { ProductImage } from '@/utils/imageHelper';


const OrderManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading, totalPages, currentPage } = useSelector(
    (state: RootState) => state.order
  );

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    dispatch(
      fetchAllOrders({
        page: currentPage,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'DESC',
        keyword: searchKeyword,
      })
    );
  }, [dispatch, currentPage, searchKeyword]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handlePageChange = (page: number) => {
    dispatch(
      fetchAllOrders({
        page,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'DESC',
        keyword: searchKeyword,
      })
    );
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    await dispatch(updateOrderStatus({ id: orderId, data: { status: newStatus } }));
    dispatch(
      fetchAllOrders({
        page: currentPage,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'DESC',
        keyword: searchKeyword,
      })
    );
  };

  const statusFilterOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: ORDER_STATUS.PENDING, label: 'Chờ xử lý' },
    { value: ORDER_STATUS.SHIPPING, label: 'Đang giao' },
    { value: ORDER_STATUS.COMPLETED, label: 'Hoàn thành' },
    { value: ORDER_STATUS.CANCELLED, label: 'Đã hủy' },
  ];

  const statusUpdateOptions = [
    { value: ORDER_STATUS.PENDING, label: 'Chờ xử lý' },
    { value: ORDER_STATUS.SHIPPING, label: 'Đang giao' },
    { value: ORDER_STATUS.COMPLETED, label: 'Hoàn thành' },
    { value: ORDER_STATUS.CANCELLED, label: 'Đã hủy' },
  ];

  // Filter orders by status
  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý và xử lý đơn hàng khách hàng</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm đơn hàng..." />
          </div>
          <div className="w-full sm:w-64">
            <Select
              options={statusFilterOptions}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Mã đơn</th>
                  <th className="table-header-cell">Khách hàng</th>
                  <th className="table-header-cell">Ngày đặt</th>
                  <th className="table-header-cell">Sản phẩm</th>
                  <th className="table-header-cell">Tổng tiền</th>
                  <th className="table-header-cell">Trạng thái</th>
                  <th className="table-header-cell">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={7} />
                  ))
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="table-row">
                      <td className="table-cell">
                        <span className="font-semibold text-primary-600">#{order.id}</span>
                      </td>
                      <td className="table-cell">
                        <div>
                          <p className="font-medium">{order.username}</p>
                          <p className="text-sm text-gray-500">{order.userEmail}</p>
                        </div>
                      </td>
                      <td className="table-cell text-sm">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="table-cell">
                        <div className="text-sm">
                          {order.items.slice(0, 2).map((item) => (
                            <p key={item.id}>
                              {item.productName} x{item.quantity}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-gray-500">+{order.items.length - 2} khác</p>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-sm border-0 font-medium cursor-pointer focus:ring-0 px-2 py-1 rounded-full ${
                            order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'SHIPPING'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {statusUpdateOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="table-cell">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                          leftIcon={<Eye size={16} />}
                        >
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="table-cell text-center text-gray-500 py-8">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Thông tin đơn hàng</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                    <span className="ml-2 font-semibold text-primary-600">
                      #{selectedOrder.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Ngày đặt:</span>
                    <span className="ml-2 font-medium">
                      {formatDateTime(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <Badge
                      variant={getOrderStatusColor(selectedOrder.status) as any}
                      className="ml-2"
                    >
                      {getOrderStatusText(selectedOrder.status)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Thanh toán:</span>
                    <span className="ml-2 font-medium">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Thông tin khách hàng</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Tên:</span>
                    <span className="ml-2 font-medium">{selectedOrder.username}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{selectedOrder.userEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Thông tin giao hàng</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Người nhận:</span>
                  <span className="ml-2 font-medium">{selectedOrder.recipientName}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Số điện thoại:</span>
                  <span className="ml-2 font-medium">{selectedOrder.recipientPhone}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Địa chỉ:</span>
                  <span className="ml-2 font-medium">{selectedOrder.shippingAddress}</span>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <span className="text-sm text-gray-600">Ghi chú:</span>
                    <span className="ml-2 font-medium">{selectedOrder.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Sản phẩm đặt hàng</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <ProductImage
  src={item.productImageUrl}
  alt={item.productName}
  className="w-20 h-20 rounded-lg object-cover"
/>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(selectedOrder.totalPrice)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-6">
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Đóng
                </Button>
                {selectedOrder.status === 'PENDING' && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'SHIPPING');
                      setSelectedOrder(null);
                    }}
                  >
                    Xác nhận giao hàng
                  </Button>
                )}
                {selectedOrder.status === 'SHIPPING' && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'COMPLETED');
                      setSelectedOrder(null);
                    }}
                  >
                    Hoàn thành đơn hàng
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default OrderManagementPage;