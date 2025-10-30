import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StatisticsState, DateRangeRequest } from '@/types/statistics.types';
import { getDashboardStatisticsAPI, getStatisticsByDateRangeAPI } from './statisticsAPI';
import toast from 'react-hot-toast';

// Initial state
const initialState: StatisticsState = {
  data: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDashboardStatistics = createAsyncThunk(
  'statistics/fetchDashboardStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardStatisticsAPI();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thống kê');
    }
  }
);

export const fetchStatisticsByDateRange = createAsyncThunk(
  'statistics/fetchStatisticsByDateRange',
  async (params: DateRangeRequest, { rejectWithValue }) => {
    try {
      const response = await getStatisticsByDateRangeAPI(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thống kê');
    }
  }
);

// Slice
const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearStatistics: (state) => {
      state.data = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard statistics
    builder.addCase(fetchDashboardStatistics.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDashboardStatistics.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchDashboardStatistics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch statistics by date range
    builder.addCase(fetchStatisticsByDateRange.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStatisticsByDateRange.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchStatisticsByDateRange.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export const { clearStatistics, clearError } = statisticsSlice.actions;
export default statisticsSlice.reducer;