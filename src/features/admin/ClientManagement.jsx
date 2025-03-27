import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients } from './clientsSlice';
import { fetchRoles } from './accountsSlice';
import { hideModal, setLoading, showModal, showToast } from '../ui/uiSlice';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';

const ClientManagement = () => {
  const dispatch = useDispatch();
  const { clients } = useSelector(state => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchRoles());
  }, []);

  const clientColumns = [
    { field: 'id', headerName: 'Client ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 120 },
    {
      field: 'roles', headerName: 'Roles', width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1,
            borderRadius: 1,
          }}
        >
          {params.value?.map(item => item.roleName)?.join(', ')}
        </Box>
      )
    },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'userStatus',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1,
            borderRadius: 1,
            backgroundColor: params.value === 'ACTIVE' ? '#4caf5020' : '#f4433620',
            color: params.value === 'ACTIVE' ? '#4caf50' : '#f44336'
          }}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            color="primary"
            component={Link}
            to={`/clients/edit/${params.row.id}`}
          >
            Edit
          </Button>
          <Button color="error" onClick={() => openDeleteModal(params.row.id)}>Delete</Button>
        </Box>
      )
    }
  ];

  const handleDeleteClient = async (id) => {
    console.log("Deleting user ", id);
    try {
      dispatch(setLoading(true));
      const res = await apiClient.delete(ENDPOINTS.DELETE_CLIENT.replace('{id}', id));
      if (res.status === 200) {
        dispatch(showToast({
          message: res.message || res.data.message || "Client was deleted!",
          type: 'success'
        }))
      } else {
        dispatch(showToast({
          message: res.message || res.data.message || "Client was not deleted!",
          type: 'error'
        }))
      }
      dispatch(hideModal());
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(showToast({
        message: error.message || "Something went wrong!",
        type: 'error'
      }))
    }
  }
  const openDeleteModal = (id) => {
    dispatch(showModal({
      title: 'Delete Client',
      description: 'Are you sure to delete this client?',
      cancelText: 'Cancel',
      actionText: 'Delete',
      action: () => handleDeleteClient(id)
    }))
  }

  return (
    <Box sx={{ p: 2 }}>
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
          rows={clients}
          columns={clientColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </Box>
  );
};

export default ClientManagement;
