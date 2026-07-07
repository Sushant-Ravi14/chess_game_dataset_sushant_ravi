import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  filters: {},
};

// Generic fetch data thunk
export const fetchData = createAsyncThunk('data/fetchData', async ({ endpoint, params }, { rejectWithValue }) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch data');
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming response structure has data array and total count
        state.items = action.payload.data || action.payload;
        state.total = action.payload.total || action.payload.length || 0;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = dataSlice.actions;
export default dataSlice.reducer;
