import { useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  CssBaseline,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import { useSelector } from 'react-redux';
import { logout } from '../../src/features/auth/authSlice';
import { selectLoading, selectToast, hideToast, hideModal, selectModal } from '../features/ui/uiSlice';
import { ENDPOINTS, ROLES } from '../utilities/constants';
import { apiClient } from '../utilities/api';

const drawerWidth = 240;
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

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles } = useSelector((state) => state.auth);
  const loading = useSelector(selectLoading);
  const toast = useSelector(selectToast);
  const modal = useSelector(selectModal);

  const handleLogout = async () => {
    try {
      await apiClient.post(ENDPOINTS.LOGOUT_USER);
    } catch (error) {
      console.log(error);
    }
    dispatch(logout());
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseModal = () => {
    dispatch(hideModal());
  }

  const adminNavItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Account Mgmt', icon: <PeopleIcon />, path: '/account-management' },
    { text: 'Client Management', icon: <PeopleIcon />, path: '/clients' },
    { text: 'Reports', icon: <DescriptionIcon />, path: '/reports' },
    { text: 'Transaction', icon: <PaymentIcon />, path: '/transactions' },
    { text: 'API Documentation', icon: <DescriptionIcon />, path: '/api-docs' },
  ];

  const clientNavItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Account Mgmt', icon: <PeopleIcon />, path: '/account-management' },
    { text: 'Profile Setting', icon: <AccountCircleIcon />, path: '/profile' },
    { text: 'Reports', icon: <DescriptionIcon />, path: '/reports' },
    { text: 'Transaction', icon: <PaymentIcon />, path: '/user-transactions' },
    { text: 'API Documentation', icon: <DescriptionIcon />, path: '/api-docs' },
  ];

  const navItems = roles?.includes(ROLES.ROLE_ADMIN) ? adminNavItems : clientNavItems;

  const drawer = (
    <div style={{ padding: 20 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ width: 40, height: 40, border: '50%', bgcolor: '#EADDFF' }}
        >
          <PersonOutlineIcon sx={{ color: '#4F378A' }} />
        </IconButton>
        <Typography>{roles?.includes(ROLES.ROLE_ADMIN) ? 'Admin' : 'User'}</Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: '40px',
              padding: '20px',
              '&.active': {
                backgroundColor: '#E2E1E1',
                '& .MuiListItemText-primary': {
                  fontWeight: 'bold',
                  color: '#49454F'
                }
              }
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button key={'Logout'} component="a" onClick={handleLogout} sx={{
          borderRadius: '40px',
          padding: '20px',
          cursor: 'pointer',
          '&.active': {
            backgroundColor: '#E2E1E1',
            '& .MuiListItemText-primary': {
              fontWeight: 'bold',
              color: '#49454F'
            }
          }
        }}>
          <ListItemText primary={'Logout'} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'white' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#F7F2FA' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { sm: 3, xs: 1 },
          width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100vw' },
          marginTop: '64px', // Height of AppBar
          overflowX: 'auto',
          height: { xs: '93vh', sm: '100%' }
        }}
      >
        <Outlet />
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={toast.show}
        autoHideDuration={6000}
        onClose={() => dispatch(hideToast())}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={toast.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <Modal
        open={modal.show}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modal.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modal.description}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="error" onClick={handleCloseModal}>{modal.cancelText}</Button>
            <Button color="success" onClick={() => modal.action()}>{modal.actionText}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
