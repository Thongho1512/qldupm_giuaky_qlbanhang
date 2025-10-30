import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryState, CategoryRequest } from '@/types/category.types';
import {
  getAllCategoriesAPI,
  getCategoryByIdAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
} from './categoryAPI';
import toast from 'react-hot-toast';

// Initial state
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllCategories = createAsyncThunk(
  'category/fetchAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCategoriesAPI();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh mục');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getCategoryByIdAPI(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin danh mục');
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (data: CategoryRequest, { rejectWithValue }) => {
    try {
      const response = await createCategoryAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo danh mục');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, data }: { id: number; data: CategoryRequest }, { rejectWithValue }) => {
    try {
      const response = await updateCategoryAPI(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật danh mục');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteCategoryAPI(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa danh mục');
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all categories
    builder.addCase(fetchAllCategories.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchAllCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch category by ID
    builder.addCase(fetchCategoryById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedCategory = action.payload;
    });
    builder.addCase(fetchCategoryById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create category
    builder.addCase(createCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories.push(action.payload);
      toast.success('Tạo danh mục thành công!');
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Update category
    builder.addCase(updateCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.selectedCategory = action.payload;
      toast.success('Cập nhật danh mục thành công!');
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Delete category
    builder.addCase(deleteCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = state.categories.filter(c => c.id !== action.payload);
      toast.success('Xóa danh mục thành công!');
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export const { clearSelectedCategory, clearError } = categorySlice.actions;
export default categorySlice.reducer;