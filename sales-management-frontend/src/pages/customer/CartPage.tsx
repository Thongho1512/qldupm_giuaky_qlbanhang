import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/utils/constants';
import { useState } from 'react';
import { ProductImage } from '@/utils/imageHelper';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    setItemToRemove(productId);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setItemToRemove(null);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearDialog(false);
  };

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <EmptyState
            icon="cart"
            title="Giỏ hàng trống"
            description="Bạn chưa có sản phẩm nào trong giỏ hàng"
            action={{
              label: 'Mua sắm ngay',
              onClick: () => navigate(ROUTES.PRODUCTS),
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
              >
                <ChevronLeft size={20} />
                Tiếp tục mua sắm
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Giỏ hàng của bạn
              </h1>
              <p className="text-gray-600 mt-1">
                {items.length} sản phẩm
              </p>
            </div>

            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(true)}
                leftIcon={<Trash2 size={18} />}
              >
                Xóa tất cả
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
  to={`/products/${item.product.id}`}
  className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100"
>
  <ProductImage
    src={item.product.imageUrl}
    alt={item.product.name}
    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
  />
</Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors block mb-1 truncate"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">{item.product.categoryName}</p>
                      <p className="text-xl font-bold text-primary-600">
                        {formatCurrency(item.product.price)}
                      </p>
                      {item.product.stock < 10 && (
                        <p className="text-sm text-orange-600 mt-1">
                          Chỉ còn {item.product.stock} sản phẩm
                        </p>
                      )}
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-lg font-semibold w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tổng</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Tổng đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleCheckout}
                  leftIcon={<ShoppingBag size={20} />}
                >
                  Thanh toán
                </Button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Remove Item Confirm Dialog */}
      <ConfirmDialog
        isOpen={itemToRemove !== null}
        onClose={() => setItemToRemove(null)}
        onConfirm={confirmRemove}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        confirmText="Xóa"
        variant="danger"
      />

      {/* Clear Cart Confirm Dialog */}
      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearCart}
        title="Xóa tất cả sản phẩm"
        message="Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?"
        confirmText="Xóa tất cả"
        variant="danger"
      />
    </div>
  );
};

export default CartPage;