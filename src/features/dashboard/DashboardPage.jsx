import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  TableRow,
  Chip
} from '@mui/material';
import {
  AccountBalance as BalanceIcon,
  Payment as TransactionsIcon,
  People as ClientsIcon,
  AccountBalanceWallet as DepositIcon,
  MoneyOff as WithdrawalIcon
} from '@mui/icons-material';
import { ENDPOINTS, ROLES } from '../../utilities/constants';
import { addTransactions, fetchTransactions } from '../transactions/transactionsSlice';
import { fetchClients } from '../admin/clientsSlice';
import { setLoading, showToast } from '../ui/uiSlice';
import { apiClient } from '../../utilities/api';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState('today');
  const { transactions, pagination } = useSelector(state => state.transactions);
  const { clients } = useSelector(state => state.clients);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  const stats = [
    {
      title: roles?.includes(ROLES.ROLE_ADMIN) ? 'Total Transactions' : 'Your Transactions',
      value: transactionCount,
      icon: <TransactionsIcon fontSize="large" />,
      color: '#1976d2'
    },
    {
      title: roles?.includes(ROLES.ROLE_ADMIN) ? 'Active Clients' : 'Account Balance',
      value: roles?.includes(ROLES.ROLE_ADMIN) ? clients?.length : totalDeposit,
      icon: roles?.includes(ROLES.ROLE_ADMIN) ? <ClientsIcon fontSize="large" /> : <BalanceIcon fontSize="large" />,
      color: '#4caf50'
    },
  ];

  useEffect(() => {
    fetchData();
  }, [dispatch, tabValue]);

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      let res;
      res = await apiClient.get(ENDPOINTS.GET_TRANSACTION_DASHBOARD + tabValue);
      if (res.status === 200) {
        dispatch(addTransactions(res.data.recentTransactions));
        setTotalDeposit(res.data.totalDeposit);
        setTotalWithdrawal(res.data.totalWithdrawal);
        setTransactionCount(res.data.transactionCount);
      } else {
        dispatch(showToast({
          message: res.data.message || res.message || "Failed to load data!",
          type: 'error'
        }))
      }
      dispatch(setLoading(false));
    } catch (error) {
      let message;
      if (error.response && error.response.data) {
        message = error.response.data.message;
      } else {
        message = error.message;
      }

      dispatch(setLoading(false));
      dispatch(showToast({
        message: message || "Something went wrong!",
        type: 'error'
      }))
    }
  }


  const statusColor = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    refunded: 'secondary',
    error: 'error'
  };


  return (
    <Grid2 container spacing={3}>
      <Grid2 item size={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Overview</Typography>
          <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)} sx={{ '& .MuiTab-root': { p: { sm: 2, xs: 1 }, minWidth: { sm: '90px', xs: 'auto' } } }}>
            <Tab label="Monthly" value={'monthly'} />
            <Tab label="Weekly" value={'weekly'} />
            <Tab label="Today" value='today' />
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
              <Typography variant="h4">${totalDeposit}</Typography>
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
              <Typography variant="h4">${totalWithdrawal}</Typography>
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
        <Paper sx={{ overflowX: 'scroll' }}>
          <Table>
            <TableHead>
              <TableRow>
                {roles?.includes(ROLES.ROLE_ADMIN) ? (
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
              {transactions?.map((transaction) => {
                let type = statusColor.pending;
                if (transaction.transactionStatus === "PENDING") type = statusColor.in_progress;
                if (transaction.transactionStatus === "CANCEL") type = statusColor.pending;
                if (transaction.transactionStatus === "FAILED") type = statusColor.error;
                if (transaction.transactionStatus === "COMPLETED") type = statusColor.completed;
                return (
                  <TableRow key={transaction.orderId}>
                    {roles?.includes(ROLES.ROLE_ADMIN) ? (
                      <>
                        <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                        <TableCell>{transaction.amount} {transaction.currency}</TableCell>
                        <TableCell>{transaction.transactionType}</TableCell>
                        <TableCell>{transaction.orderId}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.transactionStatus}
                            color={type}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{transaction.orderId}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                        <TableCell>{transaction.amount} {transaction.currency}</TableCell>
                        <TableCell>{transaction.transactionAccount?.bank}</TableCell>
                        <TableCell>******{transaction.transactionAccount?.accountNumber.substring(5)}</TableCell>
                        <TableCell>{transaction.transactionType}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.transactionStatus}
                            color={type}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Paper>
      </Grid2>
    </Grid2>
  );
};

export default DashboardPage;
