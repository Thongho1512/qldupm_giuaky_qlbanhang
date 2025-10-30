import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { MapPin, User, Phone, FileText, CreditCard, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { AppDispatch } from '@/store/store';
import { createOrder, createGuestOrder } from '@/features/order/orderSlice';
import { OrderRequest, GuestOrderRequest } from '@/types/order.types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES, PAYMENT_METHODS } from '@/utils/constants';
import { useState } from 'react';
import { ProductImage } from '@/utils/imageHelper';
// Sửa schema
const schema = yup.object({
  recipientName: yup.string().required('Họ tên người nhận là bắt buộc'),
  recipientPhone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
  shippingAddress: yup.string().required('Địa chỉ giao hàng là bắt buộc'),
  notes: yup.string().optional(),
  paymentMethod: yup.string().required('Phương thức thanh toán là bắt buộc'),
});

type CheckoutFormData = Omit<OrderRequest, 'items'>;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      paymentMethod: 'COD',
    },
  });

  useEffect(() => {
    

    if (items.length === 0) {
      navigate(ROUTES.CART);
      return;
    }

    // Pre-fill user info
    if (user && isAuthenticated) {
      setValue('recipientName', user.fullName || '');
      setValue('recipientPhone', user.phone || '');
    }
  }, [isAuthenticated, items, user, navigate, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    const itemsData = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    let result;

    if (isAuthenticated) {
      // ✅ User đã đăng nhập - dùng API cũ
      const orderData: OrderRequest = {
        items: itemsData,
        shippingAddress: data.shippingAddress,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
      };
      result = await dispatch(createOrder(orderData));
    } else {
      // ✅ Guest - dùng API mới
      const guestOrderData: GuestOrderRequest = {
        items: itemsData,
        shippingAddress: data.shippingAddress,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
      };
      result = await dispatch(createGuestOrder(guestOrderData));
    }

    if (result.type.includes('fulfilled')) {
      clearCart();
      
      if (isAuthenticated) {
        navigate(ROUTES.ORDER_HISTORY);
      } else {
        // ✅ Guest không có order history, redirect về home
        navigate(ROUTES.HOME);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="text-primary-600" size={24} />
                    Thông tin giao hàng
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label="Họ tên người nhận"
                      placeholder="Nhập họ tên"
                      leftIcon={<User size={20} />}
                      error={errors.recipientName?.message}
                      {...register('recipientName')}
                    />

                    <Input
                      label="Số điện thoại"
                      placeholder="Nhập số điện thoại"
                      leftIcon={<Phone size={20} />}
                      error={errors.recipientPhone?.message}
                      {...register('recipientPhone')}
                    />

                    <Textarea
                      label="Địa chỉ giao hàng"
                      placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                      rows={3}
                      error={errors.shippingAddress?.message}
                      {...register('shippingAddress')}
                    />

                    <Textarea
                      label="Ghi chú"
                      placeholder="Ghi chú về đơn hàng (tùy chọn)"
                      rows={3}
                      error={errors.notes?.message}
                      {...register('notes')}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="text-primary-600" size={24} />
                    Phương thức thanh toán
                  </h2>

                  <Select
                    options={PAYMENT_METHODS}
                    error={errors.paymentMethod?.message}
                    {...register('paymentMethod')}
                  />

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Lưu ý:</strong> Hiện tại chúng tôi chỉ hỗ trợ thanh toán khi nhận hàng (COD)
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Đơn hàng
                  </h2>

                  {/* Products */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
  <ProductImage
    src={item.product.imageUrl}
    alt={item.product.name}
    className="w-full h-full object-cover"
  />
</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            x{item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-primary-600">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span className="font-semibold text-green-600">Miễn phí</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="mt-6 space-y-3">
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      isLoading={isSubmitting}
                      leftIcon={<ShoppingBag size={20} />}
                    >
                      Đặt hàng
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => navigate(ROUTES.CART)}
                    >
                      Quay lại giỏ hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;