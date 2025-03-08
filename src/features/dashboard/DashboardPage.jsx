import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Grid2, 
  Paper, 
  Typography, 
  Box, 
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import {
  AccountBalance as BalanceIcon,
  Payment as TransactionsIcon,
  People as ClientsIcon,
  AccountBalanceWallet as DepositIcon,
  MoneyOff as WithdrawalIcon
} from '@mui/icons-material';

const DashboardPage = () => {
  const { role } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);

  const stats = [
    {
      title: role === 'admin' ? 'Total Transactions' : 'Your Transactions',
      value: '2,845',
      icon: <TransactionsIcon fontSize="large" />,
      color: '#1976d2'
    },
    {
      title: role === 'admin' ? 'Active Clients' : 'Account Balance',
      value: role === 'admin' ? '143' : '$12,450.00',
      icon: role === 'admin' ? <ClientsIcon fontSize="large" /> : <BalanceIcon fontSize="large" />,
      color: '#4caf50'
    },
  ];

  return (
    <Grid2 container spacing={3}>
      <Grid2 item size={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Overview</Typography>
          <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)}>
            <Tab label="Monthly" />
            <Tab label="Weekly" />
            <Tab label="Today" />
          </Tabs>
        </Box>
      </Grid2>

      {/* Totals Section */}
      <Grid2 item size={12} container spacing={3}>
        <Grid2 item size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ 
            p: 3,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1976d215',
            borderLeft: '4px solid #1976d2'
          }}>
            <Box sx={{
              backgroundColor: '#1976d230',
              p: 1.5,
              borderRadius: '50%',
              mr: 2
            }}>
              <DepositIcon fontSize="large" />
            </Box>
            <div>
              <Typography variant="h6" color="textSecondary">
                Total Deposit
              </Typography>
              <Typography variant="h4">$24,500.00</Typography>
            </div>
          </Paper>
        </Grid2>
        <Grid2 item size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ 
            p: 3,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#d32f2f15',
            borderLeft: '4px solid #d32f2f'
          }}>
            <Box sx={{
              backgroundColor: '#d32f2f30',
              p: 1.5,
              borderRadius: '50%',
              mr: 2
            }}>
              <WithdrawalIcon fontSize="large" />
            </Box>
            <div>
              <Typography variant="h6" color="textSecondary">
                Total Withdrawal
              </Typography>
              <Typography variant="h4">$18,230.00</Typography>
            </div>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Existing Stats Cards */}
      {stats.map((stat, index) => (
        <Grid2 item size={{ xs: 12, sm: 6 }} key={index}>
          <Paper sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: stat.color + '15',
            borderLeft: `4px solid ${stat.color}`
          }}>
            <Box sx={{
              backgroundColor: stat.color + '30',
              p: 1.5,
              borderRadius: '50%',
              mr: 2
            }}>
              {stat.icon}
            </Box>
            <div>
              <Typography variant="h6" color="textSecondary">
                {stat.title}
              </Typography>
              <Typography variant="h4" component="div">
                {stat.value}
              </Typography>
            </div>
          </Paper>
        </Grid2>
      ))}

      {/* Recent Transactions Table */}
      <Grid2 item size={12} sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
        <Paper>
          <Table>
          <TableHead>
            <TableRow>
              {role === 'admin' ? (
                <>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Ref ID</TableCell>
                  <TableCell>Status</TableCell>
                </>
              ) : (
                <>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Funds</TableCell>
                  <TableCell>Bank</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1,2,3].map((row) => (
              <TableRow key={row}>
                {role === 'admin' ? (
                  <>
                    <TableCell>2025-03-0{row}</TableCell>
                    <TableCell>${row}500.00</TableCell>
                    <TableCell>Deposit</TableCell>
                    <TableCell>REF{row}2345</TableCell>
                    <TableCell>Completed</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>TXID{row}234</TableCell>
                    <TableCell>2025-03-0{row}</TableCell>
                    <TableCell>${row}200.00</TableCell>
                    <TableCell>Bank of America</TableCell>
                    <TableCell>******{row}2345</TableCell>
                    <TableCell>Withdrawal</TableCell>
                    <TableCell>Pending</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </Paper>
      </Grid2>
    </Grid2>
  );
};

export default DashboardPage;
