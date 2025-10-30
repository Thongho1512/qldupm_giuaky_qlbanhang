import { CartItemRequest } from './cart.types';

// Order Status
export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Order Item
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  productImageUrl: string;
}

// Order
export interface Order {
  id: number;
  userId: number;
  username: string;
  userEmail: string;
  totalPrice: number;
  status: string; // "PENDING" | "SHIPPING" | "COMPLETED" | "CANCELLED"
  paymentMethod: string;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  notes: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Order Request
export interface OrderRequest {
  items: CartItemRequest[];
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  notes?: string;
  paymentMethod?: string; // Default: "COD"
}

// Update Order Status Request
export interface UpdateOrderStatusRequest {
  status: string; // "PENDING" | "SHIPPING" | "COMPLETED" | "CANCELLED"
}

// Order State
export interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

export interface GuestOrderRequest{
  items: CartItemRequest[];
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  notes?: string;
  paymentMethod?: string; // Default: "COD"
}