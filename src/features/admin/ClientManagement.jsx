import { useState, useEffect } from 'react';
import { 
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients } from './clientsSlice';

const ClientManagement = () => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.clients);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Client Management</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search clients..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1,
                    borderRadius: 1,
                    backgroundColor: client.active ? '#4caf5020' : '#f4433620',
                    color: client.active ? '#4caf50' : '#f44336'
                  }}>
                    {client.active ? 'Active' : 'Inactive'}
                  </Box>
                </TableCell>
                <TableCell>{new Date(client.lastActive).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClientManagement;
