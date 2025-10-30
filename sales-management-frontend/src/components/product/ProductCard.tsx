// src/components/product/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types/product.types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { getProductStatusColor, getProductStatusText } from '@/utils/helpers';
import { ProductImage } from '@/utils/imageHelper';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }
    
    addToCart(product, 1);
  };

  const isOutOfStock = product.stock <= 0 || product.status === 'OUT_OF_STOCK';

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Image - Fixed aspect ratio */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        {product.status !== 'ACTIVE' && (
          <div className="absolute top-3 left-3">
            <Badge variant={getProductStatusColor(product.status) as any}>
              {getProductStatusText(product.status)}
            </Badge>
          </div>
        )}

        {/* Quick View */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Eye size={18} />}
            >
              Xem nhanh
            </Button>
          </div>
        </div>
      </div>

      {/* Content - Flexible with min-height */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category - Fixed height */}
        <p className="text-sm text-gray-500 mb-1 h-5 truncate">{product.categoryName}</p>

        {/* Name - Fixed height with line clamp */}
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors h-12 line-clamp-2 leading-6">
          {product.name}
        </h3>

        {/* Spacer to push content to bottom */}
        <div className="flex-grow"></div>

        {/* Price & Stock - Fixed height */}
        <div className="flex items-center justify-between mb-3 h-12">
          <div>
            <p className="text-xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </p>
            <p className="text-xs text-gray-500">
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Hết hàng</span>
              ) : (
                `Còn ${product.stock} sản phẩm`
              )}
            </p>
          </div>
        </div>

        {/* Add to Cart Button - Fixed height */}
        <Button
          fullWidth
          size="sm"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          leftIcon={<ShoppingCart size={18} />}
          variant={isInCart(product.id) ? 'secondary' : 'primary'}
          className="h-10"
        >
          {isOutOfStock ? 'Hết hàng' : isInCart(product.id) ? 'Đã thêm' : 'Thêm vào giỏ'}
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;