import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

export const fetchReports = createAsyncThunk('reports/fetchReports', async (requestBody) => {
  try {
    const response = await apiClient.post(ENDPOINTS.QUERY_TRANSACTIONS, requestBody);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Loading Reports failed');
  }
});

const initialState = {
  reports: [],
  query: {
    page: 1,
    size: 10,
  },
  pagination: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let data = action.payload.data;
        state.reports = data.content;
        delete data.content;
        state.pagination = data;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setQuery } = reportsSlice.actions;
export default reportsSlice.reducer;
