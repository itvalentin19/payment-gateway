import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography
} from '@mui/material';
import { Search, NavigateNext as ActionIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, addTransactions } from './transactionsSlice';

const TransactionMonitoring = () => {
  const dispatch = useDispatch();
  const { transactions, query } = useSelector((state) => state.transactions);
  const { roles } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchTransactions(query));
  }, [dispatch, query]);

  useEffect(() => {
    dispatch(addTransactions(transactions))
  }, [dispatch, transactions]);

  // const filteredTransactions = transactions.filter(transaction => {
  //   const matchesSearch = transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     transaction.amount.includes(searchTerm);
  //   const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
  //   const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
  //   return matchesSearch && matchesStatus && matchesType;
  // });

  const navigate = useNavigate();

  const statusColor = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    refunded: 'secondary',
    error: 'error'
  };

  // Separate transactions into two groups
  const pendingWithdrawals = transactions.filter(
    t => t.transactionStatus === "PENDING"
  );

  const processedTransactions = transactions.filter(
    t => t.transactionStatus !== "PENDING"
  );

  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      <Typography variant="h4" gutterBottom>
        Transaction
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search transactions..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="payment">Payment</MenuItem>
            <MenuItem value="refund">Refund</MenuItem>
            <MenuItem value="withdrawal">Withdrawal</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>New Requests</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingWithdrawals.map((transaction) => {
                let type = statusColor.pending;
                if (transaction.transactionStatus === "PENDING") type = statusColor.in_progress;
                if (transaction.transactionStatus === "CANCEL") type = statusColor.pending;
                if (transaction.transactionStatus === "FAILED") type = statusColor.error;
                if (transaction.transactionStatus === "COMPLETED") type = statusColor.completed;
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date().toLocaleString()}</TableCell>
                    <TableCell>{transaction.transactionAccount?.name}</TableCell>
                    <TableCell>{transaction.amount} {transaction.currency}</TableCell>
                    <TableCell>{transaction.transactionAccount?.bank}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.transactionStatus}
                        color={type}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transaction.transactionType}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/transactions/${transaction.id}`)}>
                        <ActionIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Processed Transactions</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>By</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processedTransactions.map((transaction) => {
                let type = statusColor.pending;
                if (transaction.transactionStatus === "PENDING") type = statusColor.in_progress;
                if (transaction.transactionStatus === "CANCEL") type = statusColor.pending;
                if (transaction.transactionStatus === "FAILED") type = statusColor.error;
                if (transaction.transactionStatus === "COMPLETED") type = statusColor.completed;
                if (transaction.transactionStatus === "REFUNDED") type = statusColor.refunded;
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{new Date().toLocaleString()}</TableCell>
                    <TableCell>{transaction.transactionAccount?.name}</TableCell>
                    <TableCell>{transaction.amount} {transaction.currency}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.transactionStatus}
                        color={type}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transaction.transactionType}</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/transactions/${transaction.id}`)}>
                        <ActionIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default TransactionMonitoring;
