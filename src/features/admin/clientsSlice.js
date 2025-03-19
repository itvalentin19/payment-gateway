import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_CLIENTS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Loading Clients failed');
  }
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
  state.clients.clients.find(client => client.id === parseInt(clientId));
export default clientsSlice.reducer;
