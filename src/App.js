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
import TransactionMonitoring from './features/transactions/TransactionMonitoring';
import ProfileSettings from './features/profile/ProfileSettings';

function App() {
  // return (
  //   <LoginPage />
  // )
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
                  <Route path="/clients" element={<ClientManagement />} />
                  <Route path="/transactions" element={<TransactionMonitoring />} />
                  <Route path="/api-docs" element={<div>API Docs</div>} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requiredRole="client" />}>
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
