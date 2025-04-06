import { useEffect, useId, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid2,
  Alert
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, clearError, fetchProfile, setUser, updateProfile } from './profileSlice';
import { fetchClients, selectClientById } from '../admin/clientsSlice';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

const ProfileSchema2 = Yup.object({
  username: Yup.string().email('Invalid email').required('Required'),
  currentPassword: Yup.string(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  matchingPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { user, loading, error } = useSelector((state) => state.profile);
  const [successMessage, setSuccessMessage] = useState('');
  const client = useSelector(state => useId ? selectClientById(state, parseInt(userId)) : null);
  const formik = useRef();
  const formik2 = useRef();

  useEffect(() => {
    if (client) {
      dispatch(setUser(client))
    } else {
      dispatch(fetchClients());
    }
  }, [client]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (formik.current && user) {
      formik.current.setFieldValue('id', user.id);
      formik.current.setFieldValue('name', user.name);
      formik.current.setFieldValue('email', user.email);
    }
  }, [user, formik]);

  useEffect(() => {
    dispatch(fetchProfile(userId));
  }, [dispatch, userId]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      resetForm({ values });
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(changePassword(values)).unwrap();
      setSuccessMessage('Password updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      resetForm({ values });
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      <Typography variant="h4" gutterBottom>Profile Settings</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Grid2 container spacing={3}>
        <Grid2 item size={{ xs: 12, md: 6 }}>
          <Formik
            key={'name-email-formik'}
            ref={formik}
            initialValues={{
              id: user?.id || '',
              name: user?.name || '',
              email: user?.email || '',
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Account Information</Typography>

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  {/* <TextField
                    fullWidth
                    margin="normal"
                    label="Package"
                    name="package"
                    value={user?.packageDTO?.packageTier || ''}
                    slotProps={{
                      input: {
                        readOnly: true,
                      }
                    }}
                  /> */}
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ width: 200 }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Grid2>
        <Grid2 item size={{ xs: 12, md: 6 }}>
          <Formik
            key={'password-update-formik'}
            ref={formik2}
            initialValues={{
              username: user?.email || '',
              currentPassword: '',
              password: '',
              matchingPassword: ''
            }}
            validationSchema={ProfileSchema2}
            onSubmit={handleSubmitForChangePassword}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Change Password</Typography>

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.currentPassword && Boolean(errors.currentPassword)}
                    helperText={touched.currentPassword && errors.currentPassword}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="New Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm Password"
                    name="matchingPassword"
                    type="password"
                    value={values.matchingPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.matchingPassword && Boolean(errors.matchingPassword)}
                    helperText={touched.matchingPassword && errors.matchingPassword}
                  />
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ width: 200 }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Grid2>
      </Grid2>
    </Paper>
  );
};

export default ProfileSettings;
