import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Eye, X } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchMyOrders, cancelOrder } from '@/features/order/orderSlice';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/common/Pagination';
import Loading, { TableRowSkeleton } from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { getOrderStatusColor, getOrderStatusText } from '@/utils/helpers';
import { Order } from '@/types/order.types';
import { ROUTES } from '@/utils/constants';
import { ProductImage } from '@/utils/imageHelper';

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { orders, isLoading, totalPages, currentPage } = useSelector(
    (state: RootState) => state.order
  );

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    
    dispatch(fetchMyOrders({ page: currentPage, size: 10 }));
  }, [dispatch, isAuthenticated, navigate, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(fetchMyOrders({ page, size: 10 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    
    setIsCancelling(true);
    await dispatch(cancelOrder(orderToCancel));
    setIsCancelling(false);
    setOrderToCancel(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Đơn hàng của tôi</h1>

          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Mã đơn</th>
                    <th className="table-header-cell">Ngày đặt</th>
                    <th className="table-header-cell">Tổng tiền</th>
                    <th className="table-header-cell">Trạng thái</th>
                    <th className="table-header-cell">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={5} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : orders.length > 0 ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Mã đơn</th>
                        <th className="table-header-cell">Ngày đặt</th>
                        <th className="table-header-cell">Sản phẩm</th>
                        <th className="table-header-cell">Tổng tiền</th>
                        <th className="table-header-cell">Trạng thái</th>
                        <th className="table-header-cell">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="table-row">
                          <td className="table-cell">
                            <span className="font-semibold text-primary-600">
                              #{order.id}
                            </span>
                          </td>
                          <td className="table-cell">
                            {formatDateTime(order.createdAt)}
                          </td>
                          <td className="table-cell">
                            <div className="flex flex-col gap-1">
                              {order.items.slice(0, 2).map((item) => (
                                <span key={item.id} className="text-sm">
                                  {item.productName} x{item.quantity}
                                </span>
                              ))}
                              {order.items.length > 2 && (
                                <span className="text-sm text-gray-500">
                                  +{order.items.length - 2} sản phẩm khác
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="table-cell">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(order.totalPrice)}
                            </span>
                          </td>
                          <td className="table-cell">
                            <Badge variant={getOrderStatusColor(order.status) as any}>
                              {getOrderStatusText(order.status)}
                            </Badge>
                          </td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                                leftIcon={<Eye size={16} />}
                              >
                                Xem
                              </Button>
                              {order.status === 'PENDING' && (
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => setOrderToCancel(order.id)}
                                  leftIcon={<X size={16} />}
                                >
                                  Hủy
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <EmptyState
              icon="order"
              title="Chưa có đơn hàng"
              description="Bạn chưa có đơn hàng nào"
              action={{
                label: 'Mua sắm ngay',
                onClick: () => navigate(ROUTES.PRODUCTS),
              }}
            />
          )}
        </div>
      </main>

      <Footer />

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-semibold">{formatDateTime(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <Badge variant={getOrderStatusColor(selectedOrder.status) as any}>
                  {getOrderStatusText(selectedOrder.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-semibold">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="font-semibold text-primary-600">
                  {formatCurrency(selectedOrder.totalPrice)}
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Thông tin giao hàng</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Người nhận:</span>{' '}
                  <span className="font-medium">{selectedOrder.recipientName}</span>
                </p>
                <p>
                  <span className="text-gray-500">Số điện thoại:</span>{' '}
                  <span className="font-medium">{selectedOrder.recipientPhone}</span>
                </p>
                <p>
                  <span className="text-gray-500">Địa chỉ:</span>{' '}
                  <span className="font-medium">{selectedOrder.shippingAddress}</span>
                </p>
                {selectedOrder.notes && (
                  <p>
                    <span className="text-gray-500">Ghi chú:</span>{' '}
                    <span className="font-medium">{selectedOrder.notes}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Sản phẩm</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <ProductImage
  src={item.productImageUrl}
  alt={item.productName}
  className="w-16 h-16 rounded-lg object-cover bg-gray-100"
/>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
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
          </div>
        )}
      </Modal>

      {/* Cancel Order Confirm Dialog */}
      <ConfirmDialog
        isOpen={orderToCancel !== null}
        onClose={() => setOrderToCancel(null)}
        onConfirm={handleCancelOrder}
        title="Hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này?"
        confirmText="Hủy đơn hàng"
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
};

export default OrderHistoryPage;