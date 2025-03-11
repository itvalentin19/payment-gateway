import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Layout from './components/Layout';
import theme from './theme';
import { store, persistor } from './app/store';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ClientManagement from './features/admin/ClientManagement';
import ReportPage from './features/reports/ReportPage';
import ApiDocsPage from './features/api-docs/ApiDocsPage';
import TransactionMonitoring from './features/transactions/TransactionMonitoring';
import TransactionDetails from './features/transactions/TransactionDetails';
import ProfileSettings from './features/profile/ProfileSettings';
import AccountManagement from './features/admin/AccountManagement';
import ThresholdSetting from './features/admin/ThresholdSetting';
import AddAccount from './features/admin/AddAccount';
import AddPackage from './features/admin/AddPackage';
import AddClient from './features/admin/AddClient';
import Transactions from './features/transactions/Transactions';
import WithdrawalPage from './features/transactions/WithdrawalPage';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={false} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/clients" element={<ProtectedRoute requiredRole="admin" />}>
                    <Route index element={<ClientManagement />} />
                    <Route path="add-client" element={<AddClient />} />
                    <Route path="edit/:clientId" element={<AddClient />} />
                  </Route>
                  <Route path="/reports" element={<ReportPage />} />
                  <Route path="/transactions" element={<ProtectedRoute requiredRole="admin" ><TransactionMonitoring /></ProtectedRoute>} />
                  <Route path="/transactions/:transactionId" element={<ProtectedRoute requiredRole="admin"><TransactionDetails /></ProtectedRoute>} />
                  <Route path="/api-docs" element={<ApiDocsPage />} />
                  <Route path="/account-management">
                    <Route index element={<AccountManagement />} />
                    <Route path="add-account" element={<AddAccount />} />
                    <Route path="edit-account/:accountId" element={<AddAccount />} />
                    <Route path="add-package" element={<ProtectedRoute requiredRole="admin" ><AddPackage /></ProtectedRoute>} />
                    <Route path="threshold-settings" element={<ProtectedRoute requiredRole="admin" ><ThresholdSetting /></ProtectedRoute>} />
                  </Route>
                  <Route path="/profile" element={<ProtectedRoute requiredRole="user" ><ProfileSettings /></ProtectedRoute>} />
                  <Route path="/user-transactions" element={<ProtectedRoute requiredRole="user" />}>
                    <Route index element={<Transactions />} />
                    <Route path="withdrawal" element={<WithdrawalPage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
