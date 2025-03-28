import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_ACCOUNTS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Loading Accounts failed');
  }
});

export const fetchRoles = createAsyncThunk('accounts/fetchRoles', async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_ROLES);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Loading Accounts failed');
  }
});

const initialState = {
  accounts: [],
  roles: [],
  selected: null,
  status: 'idle',
  error: null
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action) => {
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action) => {
      const index = state.accounts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    selectAccount: (state, action) => {
      state.selected = state.accounts.find(acc => acc.id === action.payload)
    },
    deleteAccount: (state, action) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { addAccount, updateAccount, selectAccount, deleteAccount } = accountsSlice.actions;
export const selectAccountById = (state, accountId) =>
  state.accounts.accounts.find(acc => acc.id === accountId);
export default accountsSlice.reducer;
