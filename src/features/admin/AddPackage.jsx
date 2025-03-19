import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../../utilities/api';
import { setLoading, showToast } from '../ui/uiSlice';
import { ENDPOINTS } from '../../utilities/constants';
import { selectPackageById, updatePackage } from './packagesSlice';

const validationSchema = Yup.object({
  packageTier: Yup.string().required('Required'),
  commissionRate: Yup.number().required('Required').positive('Must be positive'),
  requirement: Yup.string().required('Required'),
});

const AddPackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packageId } = useParams();
  const isEditMode = !!packageId;

  const { packages } = useSelector(state => state.packages);
  const pkg = useSelector(state =>
    packageId ? selectPackageById(state, parseInt(packageId)) : null
  );


  const formik = useFormik({
    initialValues: {
      packageTier: pkg ? pkg.packageTier : 'Basic',
      commissionRate: pkg ? pkg.commissionRate : '',
      requirement: pkg ? pkg.requirement : '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      // Handle form submission here
      dispatch(setLoading(true));
      try {
        let res;
        if (!packageId) {
          res = await apiClient.post(ENDPOINTS.CREATE_PACKAGE, values);
        } else {
          res = await apiClient.put(ENDPOINTS.UPDATE_PACKAGES, { ...values, id: packageId });
        }

        if (res.status === 200) {
          dispatch(updatePackage(res.data));
        }

        dispatch(setLoading(false));
        navigate("/account-management");
      } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
        dispatch(showToast({
          message: error.message,
          type: 'error'
        }))
      }
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
          {isEditMode ? "Edit Package" : "Create New Package"}
        </Typography>

        <form onSubmit={formik.handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Grid2 container spacing={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', minWidth: '400px' }}>
            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 columns={3}>
                  <Typography variant="subtitle1">Tier:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="packageTier"
                    name="packageTier"
                    select
                    value={formik.values.packageTier}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.packageTier && Boolean(formik.errors.packageTier)}
                    helperText={formik.touched.packageTier && formik.errors.packageTier}
                  >
                    <MenuItem value="Package 1">Package 1</MenuItem>
                    <MenuItem value="Package 2">Package 2</MenuItem>
                    <MenuItem value="Package 3">Package 3</MenuItem>
                    <MenuItem value="Basic">Basic</MenuItem>
                  </TextField>
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 columns={3}>
                  <Typography variant="subtitle1">Service Fee (%):</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="commissionRate"
                    name="commissionRate"
                    type="number"
                    value={formik.values.commissionRate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.commissionRate && Boolean(formik.errors.commissionRate)}
                    helperText={formik.touched.commissionRate && formik.errors.commissionRate}
                  />
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 item columns={3}>
                  <Typography variant="subtitle1">Requirement:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="requirement"
                    name="requirement"
                    multiline
                    rows={4}
                    value={formik.values.requirement}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.requirement && Boolean(formik.errors.requirement)}
                    helperText={formik.touched.requirement && formik.errors.requirement}
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

export default AddPackage;
