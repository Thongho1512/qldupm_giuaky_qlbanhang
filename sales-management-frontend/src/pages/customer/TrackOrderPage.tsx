// sales-management-frontend/src/pages/customer/TrackOrderPage.tsx

import React, { useState } from 'react';
import { Search, Package, Calendar, DollarSign, MapPin, User, Phone } from 'lucide-react';
import axios from 'axios';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import Loading from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { getOrderStatusColor, getOrderStatusText } from '@/utils/helpers';
import { Order } from '@/types/order.types';
import { ProductImage } from '@/utils/imageHelper';
import toast from 'react-hot-toast';

const TrackOrderPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      toast.error('Vui lòng nhập mã đơn hàng hoặc email');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/orders/search`,
        {
          params: {
            keyword: searchKeyword,
            page: 0,
            size: 20,
          },
        }
      );

      const data = response.data?.data;
      
      if (data && data.content && data.content.length > 0) {
        setOrders(data.content); 
        toast.success(`Tìm thấy ${data.content.length} đơn hàng`);
      } else {
        setOrders([]);
        toast.error('Không tìm thấy đơn hàng');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setOrders([]);
      toast.error('Không thể tra cứu đơn hàng. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Package className="text-primary-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tra cứu đơn hàng
            </h1>
            <p className="text-gray-600">
              Nhập số điện thoại hoặc tên người nhân
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Số điện thoại hoặc tên người nhận"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  leftIcon={<Search size={20} />}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  isLoading={isLoading}
                  leftIcon={<Search size={20} />}
                >
                  Tra cứu
                </Button>
              </div>

              
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loading size="lg" text="Đang tìm kiếm..." />
            </div>
          )}

          {/* Results */}
          {!isLoading && hasSearched && (
            <>
              {orders.length > 0 ? (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Tìm thấy <strong>{orders.length}</strong> đơn hàng
                    </p>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                            <p className="text-xl font-bold text-primary-600">#{order.id}</p>
                          </div>
                          <Badge variant={getOrderStatusColor(order.status) as any}>
                            {getOrderStatusText(order.status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="text-gray-400" size={16} />
                            <span className="text-gray-600">
                              {formatDateTime(order.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="text-gray-400" size={16} />
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(order.totalPrice)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="text-gray-400" size={16} />
                            <span className="text-gray-600">{order.recipientName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="text-gray-400" size={16} />
                            <span className="text-gray-600">{order.recipientPhone}</span>
                          </div>
                        </div>

                        <div className="border-t pt-4 mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Sản phẩm:</p>
                          <div className="space-y-2">
                            {order.items.slice(0, 2).map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <ProductImage
                                  src={item.productImageUrl}
                                  alt={item.productName}
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    x{item.quantity} - {formatCurrency(item.subtotal)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-sm text-gray-500">
                                +{order.items.length - 2} sản phẩm khác
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          fullWidth
                          onClick={() => setSelectedOrder(order)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon="order"
                  title="Không tìm thấy đơn hàng"
                  description="Vui lòng kiểm tra lại mã đơn hàng hoặc email"
                />
              )}
            </>
          )}

          {/* Initial State */}
          {!isLoading && !hasSearched && (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500">
                Nhập thông tin để bắt đầu tra cứu đơn hàng
              </p>
            </div>
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
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-primary-600" />
                Thông tin giao hàng
              </h3>
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
    </div>
  );
};

export default TrackOrderPage;