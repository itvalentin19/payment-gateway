import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { persistedAuthReducer } from '../features/auth/authSlice';
import clientsReducer from '../features/admin/clientsSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';
import profileReducer from '../features/profile/profileSlice';
import reportsReducer from '../features/reports/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    clients: clientsReducer,
    transactions: transactionsReducer,
    profile: profileReducer,
    reports: reportsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      },
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);
