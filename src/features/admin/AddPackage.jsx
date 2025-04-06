import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button, Grid2, Paper, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, InputAdornment, Divider, useMediaQuery, useTheme } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../../utilities/api';
import { setLoading, showToast } from '../ui/uiSlice';
import { ENDPOINTS } from '../../utilities/constants';
import { fetchPackages, selectPackageById, updatePackage } from './packagesSlice';
import { fetchAccounts, selectAccount, selectAccountById } from './accountsSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from '@mui/icons-material';

const validationSchema = Yup.object({
  packageName: Yup.string().required('Required'),
  tierName: Yup.string(),
  feeRate: Yup.number().positive('Must be positive'),
  minAmount: Yup.number()
    .transform(value => (value === '' ? undefined : Number(value))) // Convert string to number
    .test('is-less-than-maxAmount', 'Min must be less than or equal to Max', function (value) {
      const { maxAmount } = this.parent;
      if (maxAmount === undefined || value === undefined) return true; // Skip if either is undefined
      return value <= maxAmount;
    }),
  maxAmount: Yup.number()
    .transform(value => (value === '' ? undefined : Number(value))) // Convert string to number
    .test('is-greater-than-minAmount', 'Max must be greater than or equal to Min', function (value) {
      const { minAmount } = this.parent;
      if (minAmount === undefined || value === undefined) return true; // Skip if either is undefined
      return value >= minAmount;
    }),
});

const AddPackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packageId } = useParams();
  const isEditMode = !!packageId;

  const { accounts, selected } = useSelector(state => state.accounts);
  const pkg = useSelector(state =>
    packageId ? selectPackageById(state, parseInt(packageId)) : null
  );
  const account = useSelector(state =>
    packageId ? selectAccountById(state, pkg?.accounts?.[0]?.id) : null
  );
  
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedAccount, setSelectedAccount] = useState('');
  const [maxPerTransaction, setMaxPerTransaction] = useState('');
  const [minPerTransaction, setMinPerTransaction] = useState('');
  const [tiers, setTiers] = useState(pkg ? pkg.packageTiers : []);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchPackages());
  }, [dispatch]);

  useEffect(() => {
    if (account) {
      setSelectedAccount(account.id);
    }
  }, [account]);


  const formik = useFormik({
    initialValues: {
      accountId: account ? account.id : '',
      packageName: pkg ? pkg.packageName : '',
      tierName: pkg ? pkg.tierName : '',
      feeRate: pkg ? pkg.feeRate : '',
      minAmount: pkg ? pkg.minAmount : '',
      maxAmount: pkg ? pkg.maxAmount : '',
      tiers: pkg ? pkg.packageTiers.map((item) => ({
        id: item.id,
        tierName: item.tierName,
        feeRate: item.feeRate,
        minAmount: item.minAmount,
        maxAmount: item.maxAmount
      })) : [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      if (values.tierName) return;
      // Handle form submission here
      dispatch(setLoading(true));
      try {
        const newValues = {
          packageName: values.packageName,
          requirement: selected?.maxDailyTransaction.toString(),
          feeTiers: values.tiers
        }
        let res;
        if (!packageId) {
          res = await apiClient.post(ENDPOINTS.CREATE_PACKAGE, { ...newValues, accountId: selectedAccount });
        } else {
          res = await apiClient.put(ENDPOINTS.UPDATE_PACKAGES, { ...newValues, id: parseInt(packageId) });
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

  const handleAddTier = () => {
    const newTier = {
      tierName: formik.values.tierName,
      feeRate: formik.values.feeRate / 100,
      minAmount: formik.values.minAmount,
      maxAmount: formik.values.maxAmount,
    };

    let errorMsg = null;

    // check if the tier is already existing
    const exTier = formik.values.tiers?.find(t => t.tierName === newTier.tierName);
    if (exTier) {
      errorMsg = 'The tier name was already taken.';
    }

    if (minPerTransaction && newTier.minAmount < minPerTransaction) {
      errorMsg = `The tier minimum fund value should be larger than ${minPerTransaction}`;
    }

    if (maxPerTransaction && newTier.maxAmount > maxPerTransaction) {
      errorMsg = `The tier maximum fund value should be smaller than ${maxPerTransaction}`;
    }

    // check if the fund range is overlapped
    const overlappedTier = formik.values.tiers?.find(t =>
      Number(newTier.minAmount) <= Number(t.maxAmount) && Number(t.minAmount) <= Number(newTier.maxAmount)
    );
    if (overlappedTier) {
      errorMsg = 'The fund range overlaps with an existing tier.';
    }

    if (errorMsg) {
      dispatch(showToast({
        message: errorMsg,
        type: 'error'
      }));
      return;
    }

    const newTiers = [...formik.values.tiers, newTier];
    setTiers(newTiers);
    formik.setValues({
      ...formik.values,
      tierName: '',
      feeRate: '',
      minAmount: '',
      maxAmount: '',
      tiers: newTiers,
    })
  }

  const handleDeleteTier = (index) => {
    const newTiers = formik.values.tiers.filter((_, i) => i !== index);
    formik.setFieldValue('tiers', newTiers);

    setTiers(newTiers);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={0} sx={{
        p: { xs: 2, sm: 3 },
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

        <form onSubmit={formik.handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Grid2 container spacing={3} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: { xs: '100%', sm: '100%', md: '60%', lg: '40%' }, }}>
              <Grid2 columns={12} size={12}>
                <Grid2 container alignItems="center" justifyContent="space-between">
                  <Grid2 columns={3}>
                    <Typography variant="subtitle1">Account Name:</Typography>
                  </Grid2>
                  <Grid2 item columns={9}>
                    <TextField
                      fullWidth
                      select
                      value={selectedAccount}
                      size='small'
                      onChange={(e) => {
                        const account = accounts?.find(a => a.id === e.target.value);
                        setSelectedAccount(e.target.value);
                        dispatch(selectAccount(e.target.value))
                        setMaxPerTransaction(account?.maxPerTransaction || '');
                        setMinPerTransaction(account?.minPerTransaction || '');
                      }}
                      sx={{ minWidth: 200 }}
                      slotProps={{
                        select: {
                          displayEmpty: true,
                          label: 'Select Account',
                        }
                      }}
                    >
                      {accounts?.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid2>
                </Grid2>
              </Grid2>
              <Grid2 columns={12} size={12} sx={{ mt: 3 }}>
                <Grid2 container alignItems="center" justifyContent="space-between">
                  <Grid2 columns={3}>
                    <Typography variant="subtitle1">Package Name:</Typography>
                  </Grid2>
                  <Grid2 item columns={9}>
                    <TextField
                      fullWidth
                      id="packageName"
                      name="packageName"
                      size='small'
                      value={formik.values.packageName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.packageName && Boolean(formik.errors.packageName)}
                      helperText={formik.touched.packageName && formik.errors.packageName}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
              <Paper sx={{ p: 2, width: '100%', display: selectedAccount ? 'block' : 'none', mt: 2 }} elevation={1}>
                <Grid2 container spacing={2}>
                  <Grid2 columns={12} size={12}>
                    <Grid2 container alignItems="center" justifyContent="space-between">
                      <Grid2 columns={3}>
                        <Typography variant="subtitle1">Tier:</Typography>
                      </Grid2>
                      <Grid2 item columns={9}>
                        <TextField
                          fullWidth
                          id="tierName"
                          name="tierName"
                          size='small'
                          select
                          value={formik.values.tierName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.tierName && Boolean(formik.errors.tierName)}
                          helperText={formik.touched.tierName && formik.errors.tierName}
                          sx={{ minWidth: 100 }}
                        >
                          {
                            Array(10).fill(0).map((item, index) => {
                              return (
                                <MenuItem key={index} value={`Tier ${index + 1}`}>{`Tier ${index + 1}`}</MenuItem>
                              )
                            })
                          }
                        </TextField>
                      </Grid2>
                    </Grid2>
                  </Grid2>

                  <Grid2 columns={12} size={12}>
                    <Grid2 container alignItems="center" justifyContent="space-between">
                      <Grid2 columns={3}>
                        <Typography variant="subtitle1">Service Fee (%):</Typography>
                      </Grid2>
                      <Grid2 item columns={9}>
                        <TextField
                          fullWidth
                          id="feeRate"
                          name="feeRate"
                          size='small'
                          type="number"
                          value={formik.values.feeRate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.feeRate && Boolean(formik.errors.feeRate)}
                          helperText={formik.touched.feeRate && formik.errors.feeRate}
                        />
                      </Grid2>
                    </Grid2>
                  </Grid2>

                  <Grid2 columns={12} size={12}>
                    <Grid2 container alignItems="center" justifyContent="space-between">
                      <Grid2 item columns={3}>
                        <Typography variant="subtitle1">Funds:</Typography>
                      </Grid2>
                      <Grid2 item size={{ sm: 12, md: 9 }}>
                        <Grid2 container>
                          <Grid2 item size={{ xs: 12, sm: 5 }}>
                            <TextField
                              fullWidth
                              id="minAmount"
                              name="minAmount"
                              size='small'
                              type='number'
                              value={formik.values.minAmount}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.touched.minAmount && Boolean(formik.errors.minAmount)}
                              helperText={formik.touched.minAmount && formik.errors.minAmount}
                              slotProps={{
                                input: {
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                },
                              }}
                            />
                          </Grid2>
                          <Grid2 item size={{ xs: 12, sm: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Divider orientation={sm ? 'vertical' : 'horizontal'} variant='middle' flexItem sx={{ opacity: 0.8, height: sm ? 30 : 0, width: sm ? 0 : '80%', mt: sm ? 0 : 3, bgcolor: 'grey' }} />
                            </Box>
                          </Grid2>
                          <Grid2 item size={{ xs: 12, sm: 5 }}>
                            <TextField
                              fullWidth
                              id="maxAmount"
                              name="maxAmount"
                              size='small'
                              type='number'
                              value={formik.values.maxAmount}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.touched.maxAmount && Boolean(formik.errors.maxAmount)}
                              helperText={formik.touched.maxAmount && formik.errors.maxAmount}
                              slotProps={{
                                input: {
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                },
                              }}
                            />
                          </Grid2>
                        </Grid2>
                      </Grid2>
                    </Grid2>
                  </Grid2>
                  <Grid2 columns={12} size={12}>
                    <Button
                      onClick={handleAddTier}
                      variant='outlined'
                      type='button'
                      sx={{ width: '100%' }}
                      size='small'
                      disabled={
                        !formik.values.tierName ||
                        !formik.values.feeRate ||
                        !formik.values.minAmount ||
                        !formik.values.maxAmount
                      }
                    >
                      <Add />
                    </Button>
                  </Grid2>
                </Grid2>
              </Paper>
            </Box>

            <Grid2 container spacing={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 3 }}>
              <Grid2 columns={12} size={12}>
                <Grid2 container alignItems="center" justifyContent="space-between">
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Tier</TableCell>
                          <TableCell>Fees</TableCell>
                          <TableCell>Funds</TableCell>
                          <TableCell>Account</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tiers?.map((tier, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{tier.tierName}</TableCell>
                              <TableCell>{tier.feeRate * 100} %</TableCell>
                              <TableCell>${tier.minAmount} - ${tier.maxAmount}</TableCell>
                              <TableCell>{selected?.name}</TableCell>
                              <TableCell>
                                <IconButton type='button' onClick={() => handleDeleteTier(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                  type='button'
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
