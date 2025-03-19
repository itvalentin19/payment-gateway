import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { ENDPOINTS, ROLES } from '../../utilities/constants';
import { fetchAccounts } from './accountsSlice';
import { fetchPackages } from './packagesSlice';
import { hideModal, setLoading, showModal, showToast } from '../ui/uiSlice';
import { apiClient } from '../../utilities/api';

const AccountManagement = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector(state => state.auth);
  const { accounts } = useSelector(state => state.accounts);
  const { packages } = useSelector(state => state.packages);

  useEffect(() => {
    dispatch(fetchAccounts());
    if (roles?.includes(ROLES.ROLE_ADMIN)) {
      dispatch(fetchPackages());
    }
  }, [roles]);

  const paymentColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'bank', headerName: 'Bank', width: 130 },
    {
      field: 'accountNumber', headerName: 'Account', width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1,
            borderRadius: 1,
          }}
        >
          ***************
        </Box>
      )
    },
    {
      field: 'token', headerName: 'Token', width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1,
            borderRadius: 1,
          }}
        >
          ***************
        </Box>
      )
    },
    { field: 'currencyCode', headerName: 'Currency', width: 100 },
    { field: 'status', headerName: 'Status', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            color="primary"
            component={Link}
            to={`/account-management/edit-account/${params.row.id}`}
          >
            Edit
          </Button>
          <Button color="error" onClick={() => openAccountDeleteModal(params.row.id)}>Delete</Button>
        </Box>
      )
    }
  ];

  const packageColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'packageTier', headerName: 'Tier', width: 130 },
    { field: 'commissionRate', headerName: 'Service Fee (%)', width: 150 },
    { field: 'requirement', headerName: 'Requirement', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            color="primary"
            component={Link}
            to={`/account-management/edit-package/${params.row.id}`}
          >
            Edit
          </Button>
          <Button color="error" onClick={() => openPackageDeleteModal(params.row.id)}>Delete</Button>
        </Box>
      )
    }
  ];

  const handleDeleteAccount = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await apiClient.delete(ENDPOINTS.DELETE_ACCOUNT.replace('{id}', id));
      if (res.status === 200) {
        dispatch(showToast({
          message: res.message || res.data.message || "Account was deleted!",
          type: 'success'
        }))
      } else {
        dispatch(showToast({
          message: res.message || res.data.message || "Account was not deleted!",
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
  const openAccountDeleteModal = (id) => {
    dispatch(showModal({
      title: 'Delete Account',
      description: 'Are you sure to delete this account?',
      cancelText: 'Cancel',
      actionText: 'Delete',
      action: () => handleDeleteAccount(id)
    }))
  }

  const handleDeletePackage = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await apiClient.delete(ENDPOINTS.DELETE_PACKAGE.replace('{id}', id));
      if (res.status === 200) {
        dispatch(showToast({
          message: res.message || res.data.message || "Package was deleted!",
          type: 'success'
        }))
      } else {
        dispatch(showToast({
          message: res.message || res.data.message || "Package was not deleted!",
          type: 'error'
        }))
      }
      dispatch(hideModal());
      dispatch(setLoading(false));
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
  const openPackageDeleteModal = (id) => {
    dispatch(showModal({
      title: 'Delete Package',
      description: 'Are you sure to delete this package?',
      cancelText: 'Cancel',
      actionText: 'Delete',
      action: () => handleDeletePackage(id)
    }))
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Account Management
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
          {
            roles?.includes(ROLES.ROLE_ADMIN) && <Typography variant="h6">Payment Accounts</Typography>
          }
          <Box>
            <Button variant="contained" sx={{ mr: 2 }} component={Link} to="add-account">
              Add New Account
            </Button>
            {
              roles?.includes(ROLES.ROLE_ADMIN) &&
              <Button variant="outlined" component={Link} to="threshold-settings">
                Threshold Setting
              </Button>
            }
          </Box>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={accounts}
            columns={paymentColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Box>

      {
        roles?.includes(ROLES.ROLE_ADMIN) && (
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
        )
      }
    </Box>
  );
};

export default AccountManagement;
