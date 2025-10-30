import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserManagementState, UserRequest } from '@/types/user.types';
import { SearchParams } from '@/types/api.types';
import {
  getAllUsersAPI,
  getUserByIdAPI,
  createUserAPI,
  updateUserAPI,
  updateUserStatusAPI,
  deleteUserAPI,
} from './userAPI';
import toast from 'react-hot-toast';

// Initial state
const initialState: UserManagementState = {
  users: [],
  selectedUser: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await getAllUsersAPI(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách người dùng');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getUserByIdAPI(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin người dùng');
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (data: UserRequest, { rejectWithValue }) => {
    try {
      const response = await createUserAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo người dùng');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, data }: { id: number; data: Partial<UserRequest> }, { rejectWithValue }) => {
    try {
      const response = await updateUserAPI(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật người dùng');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await updateUserStatusAPI(id, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật trạng thái người dùng');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteUserAPI(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa người dùng');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all users
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.pageNumber;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch user by ID
    builder.addCase(fetchUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedUser = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create user
    builder.addCase(createUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users.push(action.payload);
      toast.success('Tạo người dùng thành công!');
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Update user
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.selectedUser = action.payload;
      toast.success('Cập nhật người dùng thành công!');
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Update user status
    builder.addCase(updateUserStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      toast.success('Cập nhật trạng thái người dùng thành công!');
    });
    builder.addCase(updateUserStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Delete user
    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.filter(u => u.id !== action.payload);
      toast.success('Xóa người dùng thành công!');
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export const { clearSelectedUser, clearError } = userSlice.actions;
export default userSlice.reducer;