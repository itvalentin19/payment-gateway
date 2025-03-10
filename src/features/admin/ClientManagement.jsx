import React from 'react';
import { Box, Typography, Button } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ClientManagement = () => {
  const { clients } = useSelector(state => state.clients);

  // Temporary data - update with real data structure later
  const clientData = [
    {
      id: 1,
      name: 'Client 1',
      role: 'admin',
      email: 'client1@example.com',
      tier: 'Tier 1',
      status: 'Active'
    }
  ];

  const clientColumns = [
    { field: 'id', headerName: 'Client ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'tier', headerName: 'Tier', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1,
            borderRadius: 1,
            backgroundColor: params.value === 'Active' ? '#4caf5020' : '#f4433620',
            color: params.value === 'Active' ? '#4caf50' : '#f44336'
          }}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <Button
            color="primary"
            component={Link}
            to={`/clients/edit/${params.row.id}`}
          >
            Edit
          </Button>
          <Button color="error">Delete</Button>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" gutterBottom sx={{ whiteSpace: 'nowrap' }}>
          Client Management
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="add-client"
        >
          Add New
        </Button>
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={clientData}
          columns={clientColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </Box>
  );
};

export default ClientManagement;
