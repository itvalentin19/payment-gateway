import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton, Collapse, Table, Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { ENDPOINTS, ROLES } from '../../utilities/constants';
import { fetchAccounts, selectAccount, selectAccountById } from './accountsSlice';
import { fetchPackages } from './packagesSlice';
import { hideModal, setLoading, showModal, showToast } from '../ui/uiSlice';
import { apiClient } from '../../utilities/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  zIndex: 1,
};

function Row(props) {
  const { data, openPackageDeleteModal } = props;
  const account = useSelector((state) => selectAccountById(state, parseInt(data.accountId)));
  const tierList = data.packageTiers;

  return (
    <React.Fragment>
      {
        tierList.map((tier, index) => {
          return (
            <TableRow key={index} sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell sx={index !== tierList.length - 1 && { borderBottom: 'unset' }}>
                {index === 0 ? data?.packageName : ""}
              </TableCell>
              <TableCell>{tier.tierName}</TableCell>
              <TableCell>{tier.feeRate * 100}</TableCell>
              <TableCell>${tier.minAmount} - ${tier.maxAmount}</TableCell>
              <TableCell>
                {
                  index === 0 && (
                    <Box>
                      <Button
                        color="primary"
                        component={Link}
                        to={`/account-management/edit-package/${data.id}`}
                      >
                        Edit
                      </Button>
                      <Button color="error" onClick={() => openPackageDeleteModal(data.id)}>Delete</Button>
                    </Box>
                  )
                }
              </TableCell>
            </TableRow>
          )
        })
      }
    </React.Fragment>
  );
}

const AccountManagement = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector(state => state.auth);
  const { accounts, selected } = useSelector(state => state.accounts);
  const { packages } = useSelector(state => state.packages);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [qrImage, setQRImage] = useState(null);

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
      field: 'qr-code', headerName: 'QR Code', width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1,
            borderRadius: 1,
          }}
        >
          <Button onClick={() => openQRCode(params.row.id)} variant='outlined' size='small'>
            View Code
          </Button>
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
    { field: 'name', headerName: 'Tier', width: 130 },
    { field: 'commissionRate', headerName: 'Service Fee (%)', width: 150 },
    {
      field: 'funds', headerName: 'Funds', width: 300,
      renderCell: (params) => (
        <Box>
          ${params.row.min} - ${params.row.max}
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
            to={`/account-management/edit-package/${params.row.id}`}
          >
            Edit
          </Button>
          <Button color="error" onClick={() => openPackageDeleteModal(params.row.id)}>Delete</Button>
        </Box>
      )
    }
  ];

  const openQRCode = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await apiClient.get(ENDPOINTS.ACCOUNT_GET_QR.replace('{id}', id), { responseType: 'blob' });
      if (res.status === 200) {
        const url = URL.createObjectURL(res.data);
        setQRImage(url);
      } else {
        dispatch(showToast({
          message: "Something went wrong!",
          type: 'error'
        }))
      }
      setOpenQRModal(true);
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

  const handleCloseModal = () => {
    setOpenQRModal(false);
  }

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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Client</TableCell>
                      <TableCell>Tier</TableCell>
                      <TableCell>Service Fee(%)</TableCell>
                      <TableCell>Funds</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      packages.map((item, index) => {
                        return (
                          <Row key={index} data={item} openPackageDeleteModal={openPackageDeleteModal} />
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Box>
        )
      }
      <Modal
        open={openQRModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            QR Code
          </Typography>
          <Box sx={{ width: '100%', height: '100%', padding: 2 }}>
            <img alt='qr code' src={qrImage} style={{ width: '100%', height: '60%', objectFit: 'contain', maxHeight: '60vh' }} />
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="error" variant='outlined' onClick={handleCloseModal}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AccountManagement;
