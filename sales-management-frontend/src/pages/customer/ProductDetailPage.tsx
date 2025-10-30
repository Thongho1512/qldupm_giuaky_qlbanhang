// src/pages/customer/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Minus, Plus, Package, ChevronLeft } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchProductById } from '@/features/product/productSlice';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Loading from '@/components/common/Loading';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductStatusColor, getProductStatusText } from '@/utils/helpers';
import { ProductImage } from '@/utils/imageHelper';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedProduct: product, isLoading } = useSelector((state: RootState) => state.product);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [dispatch, id]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }
    
    addToCart(product, quantity);
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loading size="lg" text="Đang tải sản phẩm..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-600 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại</p>
            <Button onClick={() => navigate(-1)} leftIcon={<ChevronLeft size={20} />}>
              Quay lại
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0 || product.status === 'OUT_OF_STOCK';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft size={20} />
            Quay lại
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div>
                {/* Category & Status */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-500">{product.categoryName}</span>
                  {product.status !== 'ACTIVE' && (
                    <Badge variant={getProductStatusColor(product.status) as any}>
                      {getProductStatusText(product.status)}
                    </Badge>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-primary-600">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                {/* Stock */}
                <div className="mb-6">
                  {isOutOfStock ? (
                    <p className="text-red-600 font-medium">Hết hàng</p>
                  ) : (
                    <p className="text-gray-600">
                      Còn lại: <span className="font-semibold text-gray-900">{product.stock}</span> sản phẩm
                    </p>
                  )}
                </div>

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="text-xl font-semibold w-16 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Add to Cart */}
                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    leftIcon={<ShoppingCart size={20} />}
                  >
                    {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                  </Button>
                </div>

                {/* Product Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả sản phẩm</h3>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {product.description ? (
                      <p className="whitespace-pre-line">{product.description}</p>
                    ) : (
                      <p className="text-gray-400">Chưa có mô tả cho sản phẩm này</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;