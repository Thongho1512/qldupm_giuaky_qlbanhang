import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrderState, OrderRequest, UpdateOrderStatusRequest, GuestOrderRequest } from '@/types/order.types';
import { PaginationParams } from '@/types/api.types';
import {
  createOrderAPI,
  getMyOrdersAPI,
  getOrderByIdAPI,
  cancelOrderAPI,
  getAllOrdersAPI,
  getOrdersByStatusAPI,
  updateOrderStatusAPI,
  createGuestOrderAPI
} from './orderAPI';
import toast from 'react-hot-toast';

// Initial state
const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: OrderRequest, { rejectWithValue }) => {
    try {
      const response = await createOrderAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo đơn hàng');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await getMyOrdersAPI(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByIdAPI(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin đơn hàng');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      await cancelOrderAPI(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await getAllOrdersAPI(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    }
  }
);

export const fetchOrdersByStatus = createAsyncThunk(
  'order/fetchOrdersByStatus',
  async (
    { status, params }: { status: string; params: PaginationParams },
    { rejectWithValue }
  ) => {
    try {
      const response = await getOrdersByStatusAPI(status, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async (
    { id, data }: { id: number; data: UpdateOrderStatusRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateOrderStatusAPI(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  }
);

export const createGuestOrder = createAsyncThunk(
  'order/createGuestOrder',
  async (data: GuestOrderRequest, { rejectWithValue }) => {
    try {
      const response = await createGuestOrderAPI(data);
      return response;
    }
    catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo đơn hàng cho khách');
    }
  }
)

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedOrder = action.payload;
      toast.success('Đặt hàng thành công!');
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch my orders
    builder.addCase(fetchMyOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.pageNumber;
    });
    builder.addCase(fetchMyOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch order by ID
    builder.addCase(fetchOrderById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedOrder = action.payload;
    });
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Cancel order
    builder.addCase(cancelOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      const order = state.orders.find(o => o.id === action.payload);
      if (order) {
        order.status = 'CANCELLED';
      }
      if (state.selectedOrder?.id === action.payload) {
        state.selectedOrder.status = 'CANCELLED';
      }
      toast.success('Hủy đơn hàng thành công!');
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch all orders (admin)
    builder.addCase(fetchAllOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.pageNumber;
    });
    builder.addCase(fetchAllOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch orders by status (admin)
    builder.addCase(fetchOrdersByStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.pageNumber;
    });
    builder.addCase(fetchOrdersByStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update order status (admin)
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
    // Create guest order
    builder.addCase(createGuestOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createGuestOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedOrder = action.payload;
      toast.success('Đặt hàng thành công!');
    });
    builder.addCase(createGuestOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});


export const { clearSelectedOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;