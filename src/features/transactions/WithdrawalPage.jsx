import React, { useState } from 'react';
import { Box, Typography, Grid2, Button, Divider, TextField, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const WithdrawalPage = () => {
  const { transactions, balance } = useSelector((state) => state.transactions);

  const navigate = useNavigate();
  const [availableAmount, setAvailableAmount] = useState(12000);

  const selectedAccount = {
    balance: 15000,
    available: 12000,
    maxSingle: 5000,
    maxDaily: 10000,
    commission: 1.5,
    total: 11820
  };

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
              <Typography>${balance?.balance.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Available for Withdrawal:</Typography>
              <TextField
                variant="standard"
                value={availableAmount.toLocaleString()}
                onChange={(e) => setAvailableAmount(Number(e.target.value.replace(/,/g, '')))}
                slotProps={{
                  input: {
                    startAdornment: <Typography>$</Typography>,
                    sx: { textAnchor: 'end', maxWidth: '100px', '& .MuiInput-input': { textAlign: 'end'} }
                  }
                }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Max Single Transfer Limit:</Typography>
              <Typography>${selectedAccount.maxSingle.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Max Daily Transfer Limit:</Typography>
              <Typography>${selectedAccount.maxDaily.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Commission:</Typography>
              <Typography>{balance?.commission}%</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${selectedAccount.total.toLocaleString()}</Typography>
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
                onClick={() => {/* Add withdrawal logic here */ }}
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
