import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const AccountManagement = () => {
  // Temporary data - will connect to Redux later
  const paymentAccounts = [
    { id: 1, name: 'Account 1', bank: 'Alipay', account: '123456', token: '*****' }
  ];

  const packages = [
    { id: 1, tier: 'Tier 1', serviceFee: 5, requirement: 'Basic package' }
  ];

  const paymentColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'bank', headerName: 'Bank', width: 130 },
    { field: 'account', headerName: 'Account', width: 150 },
    { field: 'token', headerName: 'Token', width: 200 },
  ];

  const packageColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'tier', headerName: 'Tier', width: 130 },
    { field: 'serviceFee', headerName: 'Service Fee (%)', width: 150 },
    { field: 'requirement', headerName: 'Requirement', width: 300 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Management
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6">Payment Accounts</Typography>
          <Box>
            <Button variant="contained" sx={{ mr: 2 }} component={Link} to="add-account">
              Add New Account
            </Button>
            <Button variant="outlined" component={Link} to="threshold-settings">
              Threshold Setting
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={paymentAccounts}
            columns={paymentColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Packages</Typography>
          <Box>
            <Button variant="contained" sx={{ mr: 2 }} component={Link} to="add-package">
              Add New Package
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={packages}
            columns={packageColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Box>
    </Box>
  );
};

export default AccountManagement;
