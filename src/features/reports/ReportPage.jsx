import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Checkbox, FormGroup, FormControlLabel, Pagination, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useSelector } from 'react-redux';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'funds', headerName: 'Funds', width: 120 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
];

export default function ReportPage() {
    const { reports } = useSelector((state) => state.reports);
    const [page, setPage] = useState(1);
    const [selectedTypes, setSelectedTypes] = useState(['Daily', 'Weekly', 'Monthly']);

    const handleTypeChange = (type) => (event) => {
        setSelectedTypes(
            event.target.checked
                ? [...selectedTypes, type]
                : selectedTypes.filter((t) => t !== type)
        );
    };

    return (
        <Box sx={{ height: 'calc(100vh - 280px)', width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Reports
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                    <FormGroup row>
                        {['Daily', 'Weekly', 'Monthly'].map((type) => (
                            <FormControlLabel
                                key={type}
                                control={
                                    <Checkbox
                                        checked={selectedTypes.includes(type)}
                                        onChange={handleTypeChange(type)}
                                    />
                                }
                                label={type}
                            />
                        ))}
                    </FormGroup>
                </Box>
                <IconButton>
                    <FileDownloadIcon />
                </IconButton>
            </Box>

            <DataGrid
                rows={reports}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                hideFooter
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={10}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </Box>
    );
}
