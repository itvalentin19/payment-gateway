import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../../utilities/api';
import { ACCOUNT_STATUS, ENDPOINTS } from '../../utilities/constants';
import { fetchAccounts, selectAccountById, updateAccount } from './accountsSlice';
import { setLoading, showToast } from '../ui/uiSlice';
import { fetchClients } from './clientsSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  bank: Yup.string().required('Required'),
  accountNumber: Yup.string().required('Required'),
  token: Yup.string(),
  userId: Yup.string().required('Required'),
});

const AddAccount = () => {
  const { accountId } = useParams();
  const isEditMode = !!accountId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector(state => state.clients);
  const { accounts } = useSelector(state => state.accounts);
  const account = useSelector((state) =>
    accountId ? selectAccountById(state, parseInt(accountId)) : null
  );

  const formik = useFormik({
    initialValues: {
      name: account ? account.name : '',
      bank: account ? account.bank : '',
      accountNumber: account ? account.accountNumber : '',
      token: account ? account.token : '',
      userId: account ? account.accountUser?.id : '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission here
      const client = clients.find(cli => cli.id === parseInt(values.userId));
      const newAcc = {
        ...values,
        maxDailyTransaction: isEditMode ? account.maxDailyTransaction : 10000,
        maxMonthlyTransaction: isEditMode ? account.maxMonthlyTransaction : 500000,
        accountStatus: ACCOUNT_STATUS[client.userStatus]
      }
      dispatch(setLoading(true));
      try {
        let res;
        if (isEditMode) {
          res = await apiClient.put(ENDPOINTS.UPDATE_ACCOUNT, { ...newAcc, id: accountId });
        } else {
          res = await apiClient.post(ENDPOINTS.CREATE_ACCOUNT, newAcc);
        }
        console.log(res);

        if (res.status === 200) {
          dispatch(updateAccount(res.account));
          dispatch(showToast({
            message: isEditMode ? "Account Updated" : "New Account Added!",
            type: 'success'
          }))
        } else {
          dispatch(showToast({
            message: res.message || "Something went wrong!",
            type: 'warning'
          }))
        }

        dispatch(setLoading(false));
        navigate("/account-management");
      } catch (error) {
        console.log(error);
        let message;
        if (error.response && error.response.data) {
          message = error.response.data.message;
        } else {
          message = error.message;
        }
        dispatch(setLoading(false));
        dispatch(showToast({
          message: message || 'Something went wrong!',
          type: 'error'
        }))
      }
    },
  });

  useEffect(() => {
    if (accountId && accounts.length === 0) {
      dispatch(fetchAccounts());
    }
  }, []);

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

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
          {isEditMode ? "Edit Account" : "Create New Account"}
        </Typography>

        <form onSubmit={formik.handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Grid2 container spacing={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', minWidth: '400px' }}>
            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={6}>
                <Grid2 columns={3}>
                  <Typography variant="subtitle1">Name:</Typography>
                </Grid2>
                <Grid2 columns={9}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 columns={3}>
                  <Typography variant="subtitle1">Bank:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="bank"
                    name="bank"
                    value={formik.values.bank}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bank && Boolean(formik.errors.bank)}
                    helperText={formik.touched.bank && formik.errors.bank}
                    select
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="Alipay">Alipay</MenuItem>
                    <MenuItem value="WeChat Pay">WeChat Pay</MenuItem>
                    <MenuItem value="Bank of China">Bank of China</MenuItem>
                    <MenuItem value="ICBC">ICBC</MenuItem>
                  </TextField>
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 columns={3}>
                  <Typography variant="subtitle1">User:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="userId"
                    name="userId"
                    value={formik.values.userId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.userId && Boolean(formik.errors.userId)}
                    helperText={formik.touched.userId && formik.errors.userId}
                    select
                    sx={{ minWidth: 100 }}
                  >
                    {
                      clients?.map(cli => {
                        return (
                          <MenuItem key={cli.id} value={cli.id}>{cli.name}</MenuItem>
                        )
                      })
                    }
                  </TextField>
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 item columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 item columns={3}>
                  <Typography variant="subtitle1">Account:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="accountNumber"
                    name="accountNumber"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                    helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                  />
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 item columns={3}>
                  <Typography variant="subtitle1">Token:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="token"
                    name="token"
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.token && Boolean(formik.errors.token)}
                    helperText={formik.touched.token && formik.errors.token}
                  />
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 item columns={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
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
        </form>
      </Paper>
    </Box>
  );
};

export default AddAccount;
