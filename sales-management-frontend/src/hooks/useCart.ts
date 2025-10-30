// sales-management-frontend/src/hooks/useCart.ts

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '@/features/cart/cartSlice';
import { Product } from '@/types/product.types';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);
  
  // ✅ Get userId từ auth state
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const userId = isAuthenticated && user ? user.id : null;

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    dispatch(addToCart({ product, quantity, userId }));
  };

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart({ productId, userId }));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity, userId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart({ userId }));
  };

  const isInCart = (productId: number): boolean => {
    return items.some(item => item.product.id === productId);
  };

  const getCartItemQuantity = (productId: number): number => {
    const item = items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };

  return {
    items,
    totalItems,
    totalPrice,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    isInCart,
    getCartItemQuantity,
  };
};