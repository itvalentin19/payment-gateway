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
import ProfileSettings from './features/profile/ProfileSettings';
import AccountManagement from './features/admin/AccountManagement';
import ThresholdSetting from './features/admin/ThresholdSetting';
import AddAccount from './features/admin/AddAccount';
import AddPackage from './features/admin/AddPackage';
import AddClient from './features/admin/AddClient';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={false} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/clients">
                    <Route index element={<ClientManagement />} />
                    <Route path="add-client" element={<AddClient />} />
                    <Route path="edit/:clientId" element={<AddClient />} />
                  </Route>
                  <Route path="/reports" element={<ReportPage />} />
                  <Route path="/transactions" element={<TransactionMonitoring />} />
                  <Route path="/api-docs" element={<ProtectedRoute><ApiDocsPage /></ProtectedRoute>} />
                  <Route path="/account-management">
                    <Route index element={<AccountManagement />} />
                    <Route path="add-account" element={<AddAccount />} />
                    <Route path="add-package" element={<AddPackage />} />
                    <Route path="threshold-settings" element={<ThresholdSetting />} />
                  </Route>
                </Route>
              </Route>

              <Route element={<ProtectedRoute requiredRole="user" />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfileSettings />} />
                  <Route path="/transaction-history" element={<TransactionMonitoring />} />
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
