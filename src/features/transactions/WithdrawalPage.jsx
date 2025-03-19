import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2, Button, Divider, TextField, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccountById } from '../admin/accountsSlice';
import { selectClientById } from '../admin/clientsSlice';
import { setLoading, showToast } from '../ui/uiSlice';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

const WithdrawalPage = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector(state => state.auth);
  const { selected } = useSelector((state) => state.accounts);
  const user = useSelector((state) => userId ? selectClientById(state, userId) : null);
  const totalBalance = selected?.accountBalance || 0;

  const navigate = useNavigate();
  const [availableAmount, setAvailableAmount] = useState(totalBalance);

  const calculateTotal = () => {
    if (totalBalance === 0 || availableAmount === 0) return 0;
    const commissionRate = user?.packageDTO?.commissionRate || 0;
    return availableAmount * (100 - commissionRate) / 100;
  }

  const handleWithdraw = async () => {
    try {
      dispatch(setLoading(true));
      let res;
      const reqBody = {
        accountId: selected.id,
        amount: availableAmount,
        transactionType: 1,
        currency: selected.currencyCode
      }
      res = await apiClient.post(ENDPOINTS.CREATE_TRANSACTION, reqBody);
      console.log(res);

      if (res.status === 200) {
        dispatch(showToast({
          message: res.data.message || res.message || 'Transaction request made!',
          type: 'success'
        }));
      } else {
        dispatch(showToast({
          message: res.data.message || 'Something went wrong!',
          type: 'error'
        }))
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      dispatch(showToast({
        message: error.message,
        type: 'error'
      }))
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Withdrawal
      </Typography>

      <Grid2 container spacing={1} sx={{ mb: 3 }} justifyContent={'center'}>
        <Grid2 item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }} elevation={0}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6'>Balance:</Typography>
              <Typography>${selected.accountBalance?.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Available for Withdrawal:</Typography>
              <TextField
                variant="standard"
                value={availableAmount.toLocaleString()}
                onChange={(e) => setAvailableAmount(Math.min(Number(e.target.value.replace(/,/g, '')), Math.min(totalBalance, selected?.maxDailyTransaction)))}
                slotProps={{
                  input: {
                    startAdornment: <Typography>$</Typography>,
                    sx: { textAnchor: 'end', maxWidth: '100px', '& .MuiInput-input': { textAlign: 'end' } }
                  }
                }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Max Single Transfer Limit:</Typography>
              <Typography>${selected?.maxDailyTransaction.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Max Daily Transfer Limit:</Typography>
              <Typography>${selected?.maxDailyTransaction.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Commission:</Typography>
              <Typography>{user?.packageDTO?.commissionRate}%</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${calculateTotal()}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/user-transactions')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleWithdraw}
                disabled={availableAmount === 0}
              >
                Withdraw
              </Button>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>

    </Box>
  );
};

export default WithdrawalPage;
