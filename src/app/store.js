import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { persistedAuthReducer } from '../features/auth/authSlice';
import accountsReducer from '../features/admin/accountsSlice';
import packagesReducer from '../features/admin/packagesSlice';
import clientsReducer from '../features/admin/clientsSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';
import profileReducer from '../features/profile/profileSlice';
import reportsReducer from '../features/reports/reportsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    accounts: accountsReducer,
    packages: packagesReducer,
    clients: clientsReducer,
    transactions: transactionsReducer,
    profile: profileReducer,
    reports: reportsReducer,
    ui: uiReducer
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
