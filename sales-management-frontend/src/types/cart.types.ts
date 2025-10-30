import { Product } from './product.types';

// Cart Item
export interface CartItem {
  product: Product;
  quantity: number;
}

// Cart Item Request (for API)
export interface CartItemRequest {
  productId: number;
  quantity: number;
}

// Cart State
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Cart Summary
export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}