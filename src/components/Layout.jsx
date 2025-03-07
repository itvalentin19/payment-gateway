import { useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, Box, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import { useSelector } from 'react-redux';
import { logout } from '../../src/features/auth/authSlice';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
    { text: 'Transaction', icon: <PaymentIcon />, path: '/transaction-history' },
    { text: 'API Documentation', icon: <DescriptionIcon />, path: '/api-docs' },
  ];

  const navItems = role === 'admin' ? adminNavItems : clientNavItems;

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
        <Typography>{role === 'admin' ? 'Admin' : 'User'}</Typography>
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px' // Height of AppBar
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
