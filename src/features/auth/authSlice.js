import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  // Actual API call would go here
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      accessToken: 'dummy-access-token',
      refreshToken: 'dummy-refresh-token',
      role: credentials?.email?.includes('admin') ? 'admin' : 'user'
    }), 1000)
  );
});

const initialState = {
  isAuthenticated: false,
  role: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

const persistConfig = {
  key: 'auth',
  storage,
  // whitelist: ['isAuthenticated', 'role', 'accessToken', 'refreshToken']
};

export const { logout } = authSlice.actions;
export const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);
export default authSlice.reducer;
