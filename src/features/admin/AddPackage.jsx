import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
  packageId: Yup.string().required('Required'),
  tier: Yup.string().required('Required'),
  serviceFee: Yup.number().required('Required').positive('Must be positive'),
  requirement: Yup.string().required('Required'),
});

const AddPackage = () => {
  const formik = useFormik({
    initialValues: {
      packageId: '',
      tier: '',
      serviceFee: '',
      requirement: '',
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
          Create New Package
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
                    id="tier"
                    name="tier"
                    select
                    value={formik.values.tier}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tier && Boolean(formik.errors.tier)}
                    helperText={formik.touched.tier && formik.errors.tier}
                  >
                    <MenuItem value="Tier 1">Tier 1</MenuItem>
                    <MenuItem value="Tier 2">Tier 2</MenuItem>
                    <MenuItem value="Tier 3">Tier 3</MenuItem>
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
                    id="serviceFee"
                    name="serviceFee"
                    type="number"
                    value={formik.values.serviceFee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.serviceFee && Boolean(formik.errors.serviceFee)}
                    helperText={formik.touched.serviceFee && formik.errors.serviceFee}
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
