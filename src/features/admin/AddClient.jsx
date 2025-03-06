import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem } from '@mui/material';
import { addClient, updateClient, selectClientById } from './clientsSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  role: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  tier: Yup.string().required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const AddClient = () => {
  const { clientId } = useParams();
  console.log(clientId);

  const isEditMode = !!clientId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useSelector((state) =>
    clientId ? selectClientById(state, clientId) : null
  );

  console.log(client);


  const formik = useFormik({
    initialValues: {
      name: '',
      role: '',
      email: '',
      tier: '',
      ...(!isEditMode && {
        password: '',
        confirmPassword: ''
      })
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (isEditMode) {
        dispatch(updateClient({ id: clientId, ...values }));
      } else {
        dispatch(addClient(values));
        navigate('/clients');
      }
    },
  });

  useEffect(() => {
    if (isEditMode && client) {
      formik.setValues({
        name: client.name,
        role: client.role,
        email: client.email,
        tier: client.tier
      });
    }
  }, [client, isEditMode, formik]);

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
          Add New Client
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
                  <Typography variant="subtitle1">Role:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                    select
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 columns={3}>
                  <Typography variant="subtitle1">Email:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid2>
              </Grid2>
            </Grid2>

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
                    value={formik.values.tier}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tier && Boolean(formik.errors.tier)}
                    helperText={formik.touched.tier && formik.errors.tier}
                    select
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
                  <Typography variant="subtitle1">Password:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 columns={3}>
                  <Typography variant="subtitle1">Confirm:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                  Create
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/clients"
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

export default AddClient;
