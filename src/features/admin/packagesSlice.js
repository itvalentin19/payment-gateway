import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

export const fetchPackages = createAsyncThunk('packages/fetchPackages', async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_PACKAGES);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Loading packages failed');
  }
});

const initialState = {
  packages: [],
  status: 'idle',
  error: null
};

const packagesSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    addPackage: (state, action) => {
      state.packages.push(action.payload);
    },
    updatePackage: (state, action) => {
      const index = state.packages.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.packages[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.packages = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { addPackage, updatePackage } = packagesSlice.actions;
export const selectPackageById = (state, packageId) =>
  state.packages.packages.find(pkg => pkg.id === packageId);
export default packagesSlice.reducer;
