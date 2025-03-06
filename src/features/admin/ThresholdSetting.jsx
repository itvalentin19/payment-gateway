import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const ThresholdSetting = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [maxDaily, setMaxDaily] = useState('');
  const [maxMonthly, setMaxMonthly] = useState('');

  // Temporary data - will connect to Redux later
  const accounts = [
    {
      id: 1,
      name: 'Account 1',
      bank: 'Alipay',
      account: '123456',
      maxDaily: 50000,
      maxMonthly: 1000000
    }
  ];

  const handleSave = () => {
    // Save logic here
    console.log('Saving thresholds:', {
      accountId: selectedAccount,
      maxDaily,
      maxMonthly
    });
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
                  <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                    <Grid2 columns={3}>
                      <Typography variant="subtitle1">Account:</Typography>
                    </Grid2>
                    <Grid2 columns={9}>
                      <TextField
                        fullWidth
                        select
                        value={selectedAccount}
                        onChange={(e) => {
                          const account = accounts.find(a => a.id === e.target.value);
                          setSelectedAccount(e.target.value);
                          setMaxDaily(account?.maxDaily || '');
                          setMaxMonthly(account?.maxMonthly || '');
                        }}
                      >
                        {accounts.map((account) => (
                          <MenuItem key={account.id} value={account.id}>
                            {account.name} ({account.bank} - {account.account})
                          </MenuItem>
                        ))}
                      </TextField>
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
                  <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                    <Grid2 columns={3}>
                      <Typography variant="subtitle1">Max Daily Transaction:</Typography>
                    </Grid2>
                    <Grid2 columns={9}>
                      <TextField
                        fullWidth
                        type="number"
                        value={maxDaily}
                        onChange={(e) => setMaxDaily(e.target.value)}
                      />
                    </Grid2>
                  </Grid2>
                </Grid2>

                <Grid2 columns={12} size={12}>
                  <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                    <Grid2 columns={3}>
                      <Typography variant="subtitle1">Max Monthly Transaction:</Typography>
                    </Grid2>
                    <Grid2 columns={9}>
                      <TextField
                        fullWidth
                        type="number"
                        value={maxMonthly}
                        onChange={(e) => setMaxMonthly(e.target.value)}
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
                  variant="contained"
                  onClick={handleSave}
                  sx={{ width: 120 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/account-management"
                  sx={{ width: 120 }}
                >
                  Cancel
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
