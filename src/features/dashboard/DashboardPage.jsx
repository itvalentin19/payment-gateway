import { useSelector } from 'react-redux';
import { Grid2, Paper, Typography, Box } from '@mui/material';
import {
  AccountBalance as BalanceIcon,
  Payment as TransactionsIcon,
  People as ClientsIcon,
  Assessment as ReportsIcon
} from '@mui/icons-material';

const DashboardPage = () => {
  const { role } = useSelector((state) => state.auth);

  const stats = [
    {
      title: role === 'admin' ? 'Total Transactions' : 'Your Transactions',
      value: '2,845',
      icon: <TransactionsIcon fontSize="large" />,
      color: '#1976d2'
    },
    {
      title: role === 'admin' ? 'Active Clients' : 'Account Balance',
      value: role === 'admin' ? '143' : '$12,450.00',
      icon: role === 'admin' ? <ClientsIcon fontSize="large" /> : <BalanceIcon fontSize="large" />,
      color: '#4caf50'
    },
    {
      title: role === 'admin' ? 'System Health' : 'Recent Activity',
      value: role === 'admin' ? '98%' : '23 New',
      icon: <ReportsIcon fontSize="large" />,
      color: '#9c27b0'
    },
  ];

  return (
    <Grid2 container spacing={3}>
      <Grid2 item size={12}>
        <Typography variant="h4" gutterBottom>
          {role === 'admin' ? 'Admin Dashboard' : 'Client Dashboard'}
        </Typography>
      </Grid2>

      {stats.map((stat, index) => (
        <Grid2 item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Paper sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: stat.color + '15',
            borderLeft: `4px solid ${stat.color}`
          }}>
            <Box sx={{
              backgroundColor: stat.color + '30',
              p: 1.5,
              borderRadius: '50%',
              mr: 2
            }}>
              {stat.icon}
            </Box>
            <div>
              <Typography variant="h6" color="textSecondary">
                {stat.title}
              </Typography>
              <Typography variant="h4" component="div">
                {stat.value}
              </Typography>
            </div>
          </Paper>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default DashboardPage;
