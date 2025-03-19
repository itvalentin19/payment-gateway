import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem, InputLabel, Select, FormControl, OutlinedInput } from '@mui/material';
import { addClient, updateClient, selectClientById } from './clientsSlice';
import { Theme, useTheme } from '@mui/material/styles';
import { fetchPackages } from './packagesSlice';
import { apiClient } from '../../utilities/api';
import { ENDPOINTS } from '../../utilities/constants';
import { setLoading, showToast } from '../ui/uiSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  roleIds: Yup.array().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  packageId: Yup.string().required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const validationEditSchema = Yup.object({
  name: Yup.string().required('Required'),
  roleIds: Yup.array().required('Required'),
  packageId: Yup.string().required('Required'),
});

const AddClient = () => {
  const { clientId } = useParams();
  const theme = useTheme();

  const isEditMode = !!clientId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useSelector((state) =>
    clientId ? selectClientById(state, clientId) : null
  );
  const { roles } = useSelector(state => state.accounts);
  const [roleIds, setRoleIds] = useState(isEditMode ? client?.roles?.map(role => role?.id) : []);
  const { packages } = useSelector(state => state.packages);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(val, field, theme) {
    return {
      fontWeight: field?.includes(val)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  const formik = useFormik({
    initialValues: {
      name: isEditMode ? client?.name : '',
      roleIds: isEditMode ? client?.roles?.map(role => role?.id) : [],
      packageId: isEditMode ? client?.packageDTO?.id : '',
      ...(isEditMode && {
        userStatus: 0
      }),
      ...(!isEditMode && {
        email: '',
        userType: 1,
        password: '',
        confirmPassword: ''
      })
    },
    validationSchema: !isEditMode ? validationSchema : validationEditSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        let res;
        if (isEditMode) {
          res = await apiClient.put(ENDPOINTS.UPDATE_CLIENT, { id: parseInt(clientId), ...values });
          if (res.status === 200) {
            dispatch(showToast({
              message: "Client Updated!",
              type: 'success'
            }))
          } else {
            dispatch(showToast({
              message: res.data.message || res.message || "Client was not updated!",
              type: 'error'
            }))
          }
        } else {
          res = await apiClient.post(ENDPOINTS.CREATE_CLIENT, values);
          if (res.status === 200) {
            dispatch(showToast({
              message: "New Client Added!",
              type: 'success'
            }))
          } else {
            dispatch(showToast({
              message: "Failed to add new client!",
              type: 'error'
            }))
          }
        }
        navigate('/clients');
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
    },
  });

  useEffect(() => {
    dispatch(fetchPackages());
  }, []);

  useEffect(() => {
    formik.setFieldValue('roleIds', roleIds);
  }, [roleIds]);


  const handleChangeRoleIds = (event) => {
    const {
      target: { value },
    } = event;
    setRoleIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

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
          {isEditMode ? "Edit Client" : "Add New Client"}
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
                  <Typography variant="subtitle1">Roles:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <FormControl sx={{ width: 200 }}>
                    <InputLabel id="demo-multiple-name-label">Roles</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple
                      value={roleIds}
                      onChange={handleChangeRoleIds}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {
                        roles?.map(cli => {
                          return (
                            <MenuItem
                              key={cli.id}
                              value={cli.id}
                              style={getStyles(cli.roleName, formik.roleIds, theme)}
                            >{cli.roleName}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid2>
              </Grid2>
            </Grid2>

            {
              !isEditMode && (
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
              )
            }

            <Grid2 columns={12} size={12}>
              <Grid2 container alignItems="center" justifyContent="space-between" spacing={4}>
                <Grid2 columns={3}>
                  <Typography variant="subtitle1">Tier:</Typography>
                </Grid2>
                <Grid2 item columns={9}>
                  <TextField
                    fullWidth
                    id="packageId"
                    name="packageId"
                    value={formik.values.packageId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.packageId && Boolean(formik.errors.packageId)}
                    helperText={formik.touched.packageId && formik.errors.packageId}
                    select
                  >
                    {
                      packages?.map(pkg => {
                        return (
                          <MenuItem key={pkg.id} value={pkg.id}>{pkg.packageTier}</MenuItem>
                        )
                      })
                    }
                  </TextField>
                </Grid2>
              </Grid2>
            </Grid2>
            {
              !isEditMode && (
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
              )
            }
            {
              !isEditMode && (
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
              )
            }

            <Grid2 item columns={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ width: 120 }}
                >
                  {isEditMode ? "Update" : "Create"}
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
