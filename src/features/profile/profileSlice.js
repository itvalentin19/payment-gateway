import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (id) => {
  // Simulated API call
  try {
    const response = await apiClient.get(ENDPOINTS.GET_CLIENT.replace('{id}', id));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Loading Profile failed');
  }
});

export const updateProfile = createAsyncThunk('profile/updateProfile',async (profileData) => {
    try {
      const response = await apiClient.put(ENDPOINTS.UPDATE_USER, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Updating Profile failed');
    }
  }
);

export const changePassword = createAsyncThunk('profile/changePassword',async (profileData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.UPDATE_USER_PASSWORD, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Updating password failed');
    }
  }
);

const initialState = {
  user: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setUser, clearError } = profileSlice.actions;
export default profileSlice.reducer;
