import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductState } from '@/types/product.types';
import { PaginationParams } from '@/types/api.types';
import {
  getActiveProductsAPI,
  getAllProductsAPI,
  getProductByIdAPI,
  getProductsByCategoryAPI,
  getLatestProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
} from './productAPI';
import toast from 'react-hot-toast';

// Initial state
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchActiveProducts = createAsyncThunk(
  'product/fetchActiveProducts',
  async (params: PaginationParams & { keyword?: string }, { rejectWithValue }) => {
    try {
      const response = await getActiveProductsAPI(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách sản phẩm');
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await getAllProductsAPI(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách sản phẩm');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getProductByIdAPI(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin sản phẩm');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'product/fetchProductsByCategory',
  async (
    { categoryId, params }: { categoryId: number; params: PaginationParams },
    { rejectWithValue }
  ) => {
    try {
      const response = await getProductsByCategoryAPI(categoryId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách sản phẩm');
    }
  }
);

export const fetchLatestProducts = createAsyncThunk(
  'product/fetchLatestProducts',
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const response = await getLatestProductsAPI(limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách sản phẩm');
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await createProductAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo sản phẩm');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await updateProductAPI(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật sản phẩm');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteProductAPI(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch active products
    builder.addCase(fetchActiveProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchActiveProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.pageNumber;
    });
    builder.addCase(fetchActiveProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch all products
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.pageNumber;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch products by category
    builder.addCase(fetchProductsByCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProductsByCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.pageNumber;
    });
    builder.addCase(fetchProductsByCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch latest products
    builder.addCase(fetchLatestProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLatestProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchLatestProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create product
    builder.addCase(createProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Tạo sản phẩm thành công!');
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Update product
    builder.addCase(updateProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedProduct = action.payload;
      toast.success('Cập nhật sản phẩm thành công!');
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = state.products.filter(p => p.id !== action.payload);
      toast.success('Xóa sản phẩm thành công!');
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export const { clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;