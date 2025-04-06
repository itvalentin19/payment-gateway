import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Typography,
  Divider,
  Radio,
  Menu
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, addTransactions, fetchBalance } from './transactionsSlice';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { fetchAccounts, selectAccount } from '../admin/accountsSlice';
import { selectClientById } from '../admin/clientsSlice';
import { showToast } from '../ui/uiSlice';

const Transactions = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { accounts } = useSelector((state) => state.accounts);
  const user = useSelector((state) => userId ? selectClientById(state, userId) : null);
  const { transactions, query } = useSelector((state) => state.transactions);
  const [selectedAccount, setSelectedAccount] = useState(null);
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
    dispatch(selectAccount(accountId));
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

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions(query));
    dispatch(fetchBalance());
  }, [dispatch]);

  useEffect(() => {
    dispatch(addTransactions(transactions))
  }, [dispatch, transactions]);

  const navigate = useNavigate();

  const handleClickWithdrawal = () => {
    if (selectedAccount) {
      navigate('withdrawal')
    } else {
      dispatch(showToast({
        message: "Select A bank Account First",
        type: 'warning'
      }))
    }
  }

  const statusColor = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    error: 'error'
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.accountBalance, 0);

  return (
    <Box sx={{ p: 3 }} elevation={0}>
      <Typography variant="h4" gutterBottom>
        Transaction
      </Typography>
      <Chip
        label={"Withdrawal"}
        onClick={handleClickWithdrawal}
        sx={{ bgcolor: '#65558F', color: 'white' }}
        variant="filled"
        size="small"
      />
      <Typography variant="h6" gutterBottom>
        Balance: ${totalBalance ?? 0}
      </Typography>
      <Typography variant="h6" gutterBottom>
        T1-Commission: {user?.packageDTO?.commissionRate ?? 0}%
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
                <TableCell>Token</TableCell>
                <TableCell>Select</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts?.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.bank}</TableCell>
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
                <TableCell>Funds</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => {
                let type = statusColor.pending;
                if (transaction.transactionStatus === "PENDING") type = statusColor.in_progress;
                if (transaction.transactionStatus === "CANCEL") type = statusColor.pending;
                if (transaction.transactionStatus === "FAILED") type = statusColor.error;
                if (transaction.transactionStatus === "COMPLETED") type = statusColor.completed;
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{new Date(transaction.createDate).toLocaleString()}</TableCell>
                    <TableCell>{transaction.transactionAccount?.bank}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.transactionStatus}
                        color={type}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
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
