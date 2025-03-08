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
        type: 'withdrawal',
        customer: { name: 'Customer One' },
        subPayments: [],
        paidAmount: 0
      },
      { 
        id: 2, 
        date: '2025-03-02', 
        reference: 'TX-002', 
        amount: '75.50', 
        currency: 'EUR', 
        status: 'pending', 
        type: 'withdrawal',
        customer: { name: 'Customer Two' },
        subPayments: [],
        paidAmount: 0
      },
      { 
        id: 3, 
        date: '2025-03-03', 
        reference: 'TX-003', 
        amount: '200.00', 
        currency: 'GBP', 
        status: 'failed', 
        type: 'withdrawal',
        customer: { name: 'Customer Three' },
        subPayments: [
          {
            id: "2389wi29",
            amount: 50,
            date: new Date().toISOString()
          }
        ],
        paidAmount: 100
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
    }
  },
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

export const { addSubPayment, addTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
