// src/utils/imageHelper.ts
/**
 * Image Helper Utility
 * Xử lý URL hình ảnh thống nhất cho toàn bộ ứng dụng
 */

import React from 'react';

// Constants
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const PLACEHOLDER_IMAGE = '/placeholder-product.png';

/**
 * Get full image URL from backend response
 * @param imageUrl - URL from backend (can be null/undefined/relative/full)
 * @returns Full image URL or placeholder
 */
export const getImageUrl = (imageUrl: string | null | undefined): string => {
  // Case 1: Empty or null → use placeholder
  if (!imageUrl || imageUrl.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }

  // Case 2: Full URL → return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Case 3: Relative path with /uploads/ → add base URL
  if (imageUrl.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  // Case 4: Filename only → add base URL + /uploads/ prefix
  return `${API_BASE_URL}/uploads/${imageUrl}`;
};

/**
 * ProductImage Component
 * Reusable image component with automatic error handling
 */
interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  onError,
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    
    // Prevent infinite loop - only set placeholder once
    if (target.src !== window.location.origin + PLACEHOLDER_IMAGE) {
      target.src = PLACEHOLDER_IMAGE;
    }
    
    // Call custom error handler if provided
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

/**
 * Alias for ProductImage - use in order/cart contexts
 */
export const OrderItemImage: React.FC<ProductImageProps> = (props) => {
  return <ProductImage {...props} />;
};