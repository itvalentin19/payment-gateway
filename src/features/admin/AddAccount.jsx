import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
  accountName: Yup.string().required('Required'),
  bank: Yup.string().required('Required'),
  accountNumber: Yup.string().required('Required'),
  token: Yup.string().required('Required'),
});

const AddAccount = () => {
  const formik = useFormik({
    initialValues: {
      accountName: '',
      bank: '',
      accountNumber: '',
      token: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      // Handle form submission here
    },
  });

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
          Create New Account
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
                    id="accountName"
                    name="accountName"
                    value={formik.values.accountName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.accountName && Boolean(formik.errors.accountName)}
                    helperText={formik.touched.accountName && formik.errors.accountName}
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
                  >
                    <MenuItem value="Alipay">Alipay</MenuItem>
                    <MenuItem value="WeChat Pay">WeChat Pay</MenuItem>
                    <MenuItem value="Bank of China">Bank of China</MenuItem>
                    <MenuItem value="ICBC">ICBC</MenuItem>
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
