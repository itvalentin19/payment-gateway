import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem, Divider, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';
import { selectAccount, updateAccount } from './accountsSlice';
import { setLoading, showToast } from '../ui/uiSlice';

const ThresholdSetting = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [maxDaily, setMaxDaily] = useState('');
  const [maxPerTransaction, setMaxPerTransaction] = useState('');
  const [minPerTransaction, setMinPerTransaction] = useState('');
  const { accounts, selected } = useSelector(state => state.accounts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSave = async () => {
    const updateAcc = {
      id: selectedAccount,
      maxDailyTransaction: parseInt(maxDaily),
      maxPerTransaction: parseInt(maxPerTransaction),
      minPerTransaction: parseInt(minPerTransaction),
    }
    if (selectedAccount &&
      (
        selectedAccount.maxDailyTransaction !== parseInt(maxDaily) ||
        selectedAccount.maxPerTransaction !== parseInt(maxPerTransaction) ||
        selectedAccount.minPerTransaction !== parseInt(minPerTransaction)
      )) {
      try {
        dispatch(setLoading(true))
        const res = await apiClient.put(ENDPOINTS.UPDATE_ACCOUNT, updateAcc);
        if (res.status === 200) {
          dispatch(updateAccount(updateAcc));
          dispatch(showToast({
            message: 'Account Updated!',
            type: 'success'
          }));
        } else {
          dispatch(showToast({
            message: res.data.message || res.message || "Something went wrong!",
            type: 'error'
          }));
        }
        dispatch(setLoading(false));
        navigate('/account-management');
      } catch (error) {
        dispatch(setLoading(false))
        dispatch(showToast({
          message: error.message || "Something went wrong!",
          type: 'error'
        }));
      }
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={0} sx={{
        p: 4,
        py: 8,
        width: '100%',
        bgcolor: 'primary',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h4" gutterBottom align="center">
          Threshold Settings
        </Typography>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Grid2 container spacing={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minWidth: '400px' }}>
            {/* Account Selection Section */}
            <Grid2 columns={12} size={6}>
              <Typography variant="h6" gutterBottom>Account Information</Typography>
              <Grid2 container spacing={3}>
                <Grid2 columns={12} size={12}>
                  <Grid2 container alignItems="center" justifyContent="space-between">
                    <Grid2 columns={3}>
                      <Typography variant="subtitle1">Account:</Typography>
                    </Grid2>
                    <Grid2 columns={9}>
                      <TextField
                        fullWidth
                        select
                        value={selectedAccount}
                        onChange={(e) => {
                          const account = accounts?.find(a => a.id === e.target.value);
                          setSelectedAccount(e.target.value);
                          dispatch(selectAccount(e.target.value))
                          setMaxDaily(account?.maxDailyTransaction || '');
                          setMaxPerTransaction(account?.maxPerTransaction || '');
                          setMinPerTransaction(account?.minPerTransaction || '');
                        }}
                        sx={{ minWidth: 200 }}
                        slotProps={{
                          select: {
                            displayEmpty: true,
                            label: 'Select Account',
                          }
                        }}
                      >
                        {accounts?.map((account) => (
                          <MenuItem key={account.id} value={account.id}>
                            {account.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid2>
                  </Grid2>
                  <Grid2 container alignItems="center" justifyContent="space-between" spacing={4} sx={{ mt: 2 }}>
                    <Grid2 columns={3}>
                      <Typography variant="subtitle1">Bank:</Typography>
                    </Grid2>
                    <Grid2 columns={9}>
                      <Typography variant="subtitle1">{selected?.bank}</Typography>
                    </Grid2>
                  </Grid2>
                </Grid2>
              </Grid2>
            </Grid2>

            <Divider variant="middle" sx={{ width: '60%' }} />

            {/* Threshold Settings Section */}
            <Grid2 columns={12} size={6}>
              <Grid2 container spacing={3}>

                <Grid2 columns={12} size={12}>
                  <Grid2 container alignItems="center" justifyContent="space-between">
                    <Grid2 size={{xs: 12, sm: 8}}>
                      <Typography variant="subtitle1">Min Per Transaction:</Typography>
                    </Grid2>
                    <Grid2 size={{xs: 12, sm: 4}}>
                      <TextField
                        fullWidth
                        type="number"
                        value={minPerTransaction}
                        onChange={(e) => setMinPerTransaction(e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">MYR</InputAdornment>,
                          },
                        }}
                      />
                    </Grid2>
                  </Grid2>
                </Grid2>

                <Grid2 columns={12} size={12}>
                  <Grid2 container alignItems="center" justifyContent="space-between">
                    <Grid2 size={{xs: 12, sm: 8}}>
                      <Typography variant="subtitle1">Max Per Transaction:</Typography>
                    </Grid2>
                    <Grid2 size={{xs: 12, sm: 4}}>
                      <TextField
                        fullWidth
                        type="number"
                        value={maxPerTransaction}
                        onChange={(e) => setMaxPerTransaction(e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">MYR</InputAdornment>,
                          },
                        }}
                      />
                    </Grid2>
                  </Grid2>
                </Grid2>

                <Grid2 columns={12} size={12}>
                  <Grid2 container alignItems="center" justifyContent="space-between">
                    <Grid2 size={{xs: 12, sm: 8}}>
                      <Typography variant="subtitle1">Max Daily Transaction:</Typography>
                    </Grid2>
                    <Grid2 size={{xs: 12, sm: 4}}>
                      <TextField
                        fullWidth
                        type="number"
                        value={maxDaily}
                        onChange={(e) => setMaxDaily(e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">MYR</InputAdornment>,
                          },
                        }}
                      />
                    </Grid2>
                  </Grid2>
                </Grid2>
              </Grid2>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>*Exceeding threshold will cause the transaction be rejected</Typography>
            </Grid2>

            <Grid2 item columns={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/account-management"
                  sx={{ width: 120 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ width: 120 }}
                >
                  Save
                </Button>
              </Box>
            </Grid2>
          </Grid2>
        </div>
      </Paper>
    </Box>
  );
};

export default ThresholdSetting;
