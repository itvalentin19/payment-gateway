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
  Typography,
  Divider,
  Radio,
  Button,
  Menu
} from '@mui/material';
import { Search, NavigateNext as ActionIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, addTransactions, fetchBalance } from './transactionsSlice';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, balance } = useSelector((state) => state.transactions);
  const [selectedAccount, setSelectedAccount] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountSelect = (accountId) => {
    setSelectedAccount(accountId);
  };

  const isCancellable = (transactionDate) => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    return new Date(transactionDate) > tenMinutesAgo;
  };

  const handleCancel = (transactionId) => {
    // Dispatch cancel transaction action here
    console.log('Canceling transaction:', transactionId);
    // Example: dispatch(cancelTransaction(transactionId));
  };
  const paymentAccounts = [
    { id: 1, name: 'Account 1', bank: 'Alipay', account: '123456', token: '*****' },
    { id: 2, name: 'Account 2', bank: 'Alipay', account: '346346', token: '*****' },
  ];

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBalance());
  }, [dispatch]);

  useEffect(() => {
    dispatch(addTransactions(transactions))
  }, [dispatch, transactions]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const navigate = useNavigate();

  const statusColor = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    error: 'error'
  };

  // Separate transactions into two groups
  const pendingWithdrawals = filteredTransactions.filter(
    t => t.paidAmount === 0
  );

  const processedTransactions = filteredTransactions.filter(
    t => t.paidAmount > 0
  );

  return (
    <Box sx={{ p: 3 }} elevation={0}>
      <Typography variant="h4" gutterBottom>
        Transaction
      </Typography>
      <Chip
        label={"Withdrawal"}
        onClick={() => navigate('withdrawal')}
        sx={{ bgcolor: '#65558F', color: 'white' }}
        variant="filled"
        size="small"
      />
      <Typography variant="h6" gutterBottom>
        Balance: ${balance?.balance ?? 0}
      </Typography>
      <Typography variant="h6" gutterBottom>
        T1-Commission: {balance?.commission ?? 0}%
      </Typography>

      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Payment Accounts
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Select</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.bank}</TableCell>
                  <TableCell>{account.account}</TableCell>
                  <TableCell>{account.token}</TableCell>
                  <TableCell>
                    <Radio
                      checked={selectedAccount === account.id}
                      onChange={() => handleAccountSelect(account.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Divider variant='middle' textAlign='center' sx={{ mx: 20 }} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Transactions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Funds</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                  <TableCell>{transaction.bank}</TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>{
                    isCancellable(transaction.date) ?
                      <Button
                        id="demo-customized-button"
                        aria-controls={open ? 'demo-customized-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDownIcon />}
                      >
                        Pending
                      </Button>
                      :
                      transaction.cancelled ?
                        <Button
                          variant="contained"
                          color="error"
                          disabled={!isCancellable(transaction.date)}
                          onClick={() => handleCancel(transaction.id)}
                        >
                          Cancelled
                        </Button>
                        :
                        <Button
                          variant="text"
                          color={statusColor.in_progress}
                        >
                          {
                            transaction.amount === transaction.paidAmount ? "Completed" : "In Progress"
                          }
                        </Button>
                  }

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Menu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} disableRipple>
            <EditIcon />
            Edit
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleClose} disableRipple>
            <CloseIcon />
            Cancel
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Transactions;
