import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  try {
    const response = await apiClient.post(ENDPOINTS.LOGIN, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
});

const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  expiresIn: null,
  type: "Bearer",
  id: null,
  userId: null,
  email: null,
  roles: null, // array of roles
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.expiresIn = null;
      state.type = null;
      state.id = null;
      state.userId = null;
      state.email = null;
      state.roles = null;
      localStorage.removeItem('accessToken');
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
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresIn = action.payload.expiresIn;
        state.type = action.payload.type;
        state.id = action.payload.id;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.roles = action.payload.roles;
        localStorage.setItem('accessToken', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.token = null;
        state.refreshToken = null;
      });
  }
});

const persistConfig = {
  key: 'auth',
  storage,
};

export const { logout } = authSlice.actions;
export const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);
export default authSlice.reducer;
