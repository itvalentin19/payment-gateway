import { useState } from 'react';
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
import { updateProfile } from './profileSlice';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  currentPassword: Yup.string().when('newPassword', {
    is: (val) => val && val.length > 0,
    then: Yup.string().required('Current password is required'),
  }),
  newPassword: Yup.string().min(8, 'Too short!'),
  confirmPassword: Yup.string().when('newPassword', {
    is: (val) => val && val.length > 0,
    then: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  }),
});

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.profile);
  const [successMessage, setSuccessMessage] = useState('');

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

  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      <Typography variant="h4" gutterBottom>Profile Settings</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" /* `ProfileSettings` is a component that likely
      displays and allows users to manage their profile
      settings. This component is rendered in the route
      path "/profile" within the application. It may
      include features such as updating user
      information, changing passwords, managing
      preferences, or any other profile-related
      functionalities. */
        sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Formik
        initialValues={{
          name: user?.name || '',
          email: user?.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
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
            <Grid2 container spacing={3}>
              <Grid2 item size={{ xs: 12, md: 6 }}>
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

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Package"
                    name="package"
                    value={user?.package || ''}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Paper>
              </Grid2>

              <Grid2 item size={{ xs: 12, md: 6 }}>
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
                    name="newPassword"
                    type="password"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.newPassword && Boolean(errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                </Paper>
              </Grid2>

              <Grid2 item size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || loading}
                    sx={{ width: 200 }}
                  >
                    {isSubmitting || loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Box>
              </Grid2>
            </Grid2>
          </form>
        )}
      </Formik>
    </Paper>
  );
};

export default ProfileSettings;
