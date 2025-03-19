import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addSubPayment, fetchTransactions, setSelectedTransaction } from './transactionsSlice';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';
import { setLoading, showToast } from '../ui/uiSlice';

const TransactionDetails = () => {
  const { transactionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactions, query, selected } = useSelector((state) => state.transactions);
  const transaction = selected ?? transactions.find(t => t.id === parseInt(transactionId));

  const [paymentId, setPaymentId] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (transactionId && transactions?.length === 0) {
      dispatch(fetchTransactions(query));
    }
  }, [transactions, transactionId]);

  useEffect(() => {
    console.log(transactionId);
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.GET_TRANSACTION.replace("{id}", transactionId));
      console.log(res);
      
      if (res.status === 200) {
        dispatch(setSelectedTransaction(res.data));
      } else {
        dispatch(showToast({
          message: "Failed to load transaction!",
          type: 'error'
        }))
      }
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

  const handleAddPayment = () => {
    if (paymentId && amount > 0) {
      dispatch(addSubPayment({
        transactionId,
        payment: { id: paymentId, amount: parseFloat(amount) }
      }));
      setPaymentId('');
      setAmount('');
    }
  };

  if (!transaction) return <Typography variant="h6">Loading...</Typography>;

  const totalPaid = transaction.subPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remaining = transaction.amount - totalPaid;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transaction #{transaction.id}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Client Information</Typography>
        <Typography>Name: {transaction.transactionAccount?.name}</Typography>
        <Typography>Requested Amount: {transaction.amount}</Typography>
        <Typography>Bank: {transaction.transactionAccount?.bank}</Typography>
        <Typography>Account: {transaction.transactionAccount?.accountNumber}</Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Add Payment</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            size="small"
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleAddPayment}
            disabled={!paymentId || !amount}
          >
            Add Payment
          </Button>
        </Box>

        <Chip
          label={`Remaining Amount: ${remaining}`}
          color={remaining > 0 ? 'warning' : 'success'}
          sx={{ mb: 2 }}
        />
      </Box>

      {transaction.subPayments?.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>Sub Payments</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transaction.subPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
};

export default TransactionDetails;
