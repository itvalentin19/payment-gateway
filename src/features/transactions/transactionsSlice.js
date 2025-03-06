import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async () => {
  // Simulated API call
  return new Promise((resolve) => 
    setTimeout(() => resolve([
      { 
        id: 1, 
        date: '2025-03-01', 
        reference: 'TX-001', 
        amount: '150.00', 
        currency: 'USD', 
        status: 'completed', 
        type: 'payment',
        customer: { name: 'Customer One' }
      },
      { 
        id: 2, 
        date: '2025-03-02', 
        reference: 'TX-002', 
        amount: '75.50', 
        currency: 'EUR', 
        status: 'pending', 
        type: 'refund',
        customer: { name: 'Customer Two' }
      },
      { 
        id: 3, 
        date: '2025-03-03', 
        reference: 'TX-003', 
        amount: '200.00', 
        currency: 'GBP', 
        status: 'failed', 
        type: 'withdrawal',
        customer: { name: 'Customer Three' }
      }
    ]), 1000)
  );
});

const initialState = {
  transactions: [],
  status: 'idle',
  error: null
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default transactionsSlice.reducer;
