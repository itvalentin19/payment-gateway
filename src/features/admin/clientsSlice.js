import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  // Simulated API call
  return new Promise((resolve) => 
    setTimeout(() => resolve([
      { id: 1, name: 'Client One', email: 'client1@example.com', active: true, lastActive: '2025-03-01' },
      { id: 2, name: 'Client Two', email: 'client2@example.com', active: false, lastActive: '2025-02-15' },
      { id: 3, name: 'Client Three', email: 'client3@example.com', active: true, lastActive: '2025-03-05' }
    ]), 1000)
  );
});

const initialState = {
  clients: [],
  status: 'idle',
  error: null
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action) => {
      const index = state.clients.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { addClient, updateClient } = clientsSlice.actions;
export const selectClientById = (state, clientId) => 
  state.clients.clients.find(client => client.id === clientId);
export default clientsSlice.reducer;
