import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData) => {
    // Simulated API call
    return new Promise((resolve) => 
      setTimeout(() => resolve({
        id: 1,
        name: profileData.name,
        email: profileData.email,
        lastUpdated: new Date().toISOString()
      }), 1000)
    );
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
  }
});

export default profileSlice.reducer;
