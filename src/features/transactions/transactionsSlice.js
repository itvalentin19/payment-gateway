import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async (requestBody) => {
   try {
     const response = await apiClient.post(ENDPOINTS.QUERY_TRANSACTIONS, requestBody);
     return response.data;
   } catch (error) {
     throw new Error(error.response?.data?.message || 'Loading Transactions failed');
   }
});

export const fetchBalance = createAsyncThunk('transactions/fetchBalance', async () => {
  // Simulated API call
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      userId: 1,
      balance: 100000,
      commission: 1
    }), 1000)
  );
});

const initialState = {
  transactions: [],
  query: {
    page: 1,
    size: 10,
  },
  selected: null,
  pagination: null,
  balance: null,
  status: 'idle',
  error: null
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addSubPayment: (state, action) => {
      const { transactionId, payment } = action.payload;
      console.log(action.payload);

      const transaction = state.transactions.find(t => t.id === parseInt(transactionId));
      if (transaction) {
        transaction.subPayments = transaction.subPayments || [];
        transaction.subPayments.push({
          ...payment,
          date: new Date().toISOString()
        });

        console.log("updated transaction");
        console.log(transaction);


        const totalPaid = transaction.subPayments.reduce((sum, p) => sum + p.amount, 0);
        if (totalPaid >= transaction.amount) {
          transaction.status = 'completed';
        } else if (totalPaid > 0) {
          transaction.status = 'in_progress';
        }
        const updatedTransactions = state.transactions.map(t => {
          if (t.id === transactionId) return transaction;
          else return t;
        });
        console.log("updatedTransactions");
        console.log(updatedTransactions);
        state.transactions = updatedTransactions;
      }

    },
    addTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setSelectedTransaction: (state, action) => {
      state.selected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let data = action.payload.data;
        state.transactions = data.content;
        delete data.content;
        state.pagination = data;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload
      })
  }
});

export const { addSubPayment, addTransactions, setSelectedTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
