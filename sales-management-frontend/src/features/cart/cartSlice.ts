// sales-management-frontend/src/features/cart/cartSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem } from '@/types/cart.types';
import { Product } from '@/types/product.types';
import { STORAGE_KEYS } from '@/utils/constants';
import toast from 'react-hot-toast';

// ✅ Helper để get cart key theo userId
const getCartStorageKey = (userId?: number | null): string => {
  if (userId) {
    return `${STORAGE_KEYS.CART}_user_${userId}`;
  }
  return `${STORAGE_KEYS.CART}_guest`;
};

// Load cart từ storage với userId
const loadCartFromStorage = (userId?: number | null): CartItem[] => {
  try {
    const cartKey = getCartStorageKey(userId);
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Save cart to storage với userId
const saveCartToStorage = (items: CartItem[], userId?: number | null) => {
  try {
    const cartKey = getCartStorageKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Calculate total price
const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

// Calculate total items
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// ✅ Initial state - load guest cart
const initialItems = loadCartFromStorage(null);
const initialState: CartState = {
  items: initialItems,
  totalItems: calculateTotalItems(initialItems),
  totalPrice: calculateTotalPrice(initialItems),
};

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number; userId?: number | null }>) => {
      const { product, quantity, userId } = action.payload;
      
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > product.stock) {
          toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
          return;
        }
        
        existingItem.quantity = newQuantity;
        toast.success('Đã cập nhật số lượng sản phẩm trong giỏ hàng!');
      } else {
        if (quantity > product.stock) {
          toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
          return;
        }
        
        state.items.push({ product, quantity });
        toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      }
      
      state.totalPrice = calculateTotalPrice(state.items);
      state.totalItems = calculateTotalItems(state.items);
      
      saveCartToStorage(state.items, userId);
    },
    
    removeFromCart: (state, action: PayloadAction<{ productId: number; userId?: number | null }>) => {
      const { productId, userId } = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
      
      state.totalPrice = calculateTotalPrice(state.items);
      state.totalItems = calculateTotalItems(state.items);
      
      saveCartToStorage(state.items, userId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    },
    
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number; userId?: number | null }>) => {
      const { productId, quantity, userId } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      
      if (item) {
        if (quantity > item.product.stock) {
          toast.error(`Chỉ còn ${item.product.stock} sản phẩm trong kho!`);
          return;
        }
        
        if (quantity < 1) {
          toast.error('Số lượng phải lớn hơn 0!');
          return;
        }
        
        item.quantity = quantity;
        
        state.totalPrice = calculateTotalPrice(state.items);
        state.totalItems = calculateTotalItems(state.items);
        
        saveCartToStorage(state.items, userId);
      }
    },
    
    clearCart: (state, action: PayloadAction<{ userId?: number | null }>) => {
      const { userId } = action.payload;
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      
      // Chỉ xóa cart của user hiện tại
      const cartKey = getCartStorageKey(userId);
      localStorage.removeItem(cartKey);
      
      toast.success('Đã xóa tất cả sản phẩm trong giỏ hàng!');
    },
    
    // ✅ QUAN TRỌNG: Sync cart khi login/logout - KHÔNG MERGE
    syncCartWithUser: (state, action: PayloadAction<{ userId: number | null }>) => {
      const { userId } = action.payload;
      
      if (userId) {
        // Đăng nhập → Xóa guest cart, load user cart
        const guestKey = getCartStorageKey(null);
        localStorage.removeItem(guestKey);
        
        const userCart = loadCartFromStorage(userId);
        state.items = userCart;
        state.totalPrice = calculateTotalPrice(userCart);
        state.totalItems = calculateTotalItems(userCart);
      } else {
        // Đăng xuất → Load guest cart (rỗng)
        const guestCart = loadCartFromStorage(null);
        state.items = guestCart;
        state.totalPrice = calculateTotalPrice(guestCart);
        state.totalItems = calculateTotalItems(guestCart);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCartWithUser,
} = cartSlice.actions;

export default cartSlice.reducer;