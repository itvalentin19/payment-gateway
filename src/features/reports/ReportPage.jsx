import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Checkbox, FormGroup, FormControlLabel, Pagination, Typography, Chip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDispatch, useSelector } from 'react-redux';
import { ROLES, TRANSACTION_TYPES } from '../../utilities/constants';
import { fetchReports, setQuery } from './reportsSlice';

export default function ReportPage() {
    const dispatch = useDispatch();
    const { roles } = useSelector((state) => state.auth);
    const { reports, query, pagination } = useSelector((state) => state.reports);
    const [page, setPage] = useState(1);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    useEffect(() => {
        dispatch(fetchReports(query));
    }, [query, dispatch]);

    useEffect(() => {
        const newQuery = {
            page: page,
            size: query.size,
        }
        const now = new Date(); // Current date and time, reused to avoid multiple instantiations

        if (selectedPeriod === 'Daily') {
            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0); // Set to midnight today
            newQuery.startDate = startOfDay.toISOString();
            newQuery.endDate = now.toISOString();
        }

        if (selectedPeriod === 'Weekly') {
            const startOfWeek = new Date(now);
            const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            startOfWeek.setDate(now.getDate() - dayOfWeek); // Move back to Sunday
            startOfWeek.setHours(0, 0, 0, 0); // Start of that day
            newQuery.startDate = startOfWeek.toISOString();
            newQuery.endDate = now.toISOString();
        }

        if (selectedPeriod === 'Monthly') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // 1st of the month
            newQuery.startDate = startOfMonth.toISOString();
            newQuery.endDate = now.toISOString();
        }

        if (selectedType != null) {
            newQuery.transactionType = TRANSACTION_TYPES[selectedType.toUpperCase()];
        }
        dispatch(setQuery(newQuery));
    }, [page, selectedType, selectedPeriod, dispatch]);

    const statusColor = {
        pending: 'warning',
        in_progress: 'info',
        completed: 'success',
        error: 'error',
        refunded: 'warning',
        close: 'secondary',
    };

    const columns = roles?.includes(ROLES.ROLE_ADMIN) ? [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'createDate', headerName: 'Date', width: 150 },
        {
            field: 'name', headerName: 'Name', width: 150, renderCell: (params) => (
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    {params.row.transactionAccount?.name}
                </Box>
            )
        },
        {
            field: 'amount', headerName: 'Funds', width: 120, renderCell: (params) => (
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    {params.row.amount} {params.row.currency}
                </Box>
            )
        },
        { field: 'transactionType', headerName: 'Type', width: 120 },
        {
            field: 'transactionStatus', headerName: 'Status', width: 120, renderCell: (params) => {
                let type = statusColor.pending;
                const transaction = params.row;
                if (transaction.transactionStatus === "PENDING") type = statusColor.in_progress;
                if (transaction.transactionStatus === "CANCEL") type = statusColor.pending;
                if (transaction.transactionStatus === "FAILED") type = statusColor.error;
                if (transaction.transactionStatus === "COMPLETED") type = statusColor.completed;
                if (transaction.transactionStatus === "REFUNDED") type = statusColor.refunded;
                if (transaction.transactionStatus === "CLOSE") type = statusColor.close;
                return (
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                        }}
                    >
                        <Chip
                            label={transaction.transactionStatus}
                            color={type}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                )
            }
        },
    ] : [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'createDate', headerName: 'Date', width: 150 },
        {
            field: 'bank', headerName: 'Bank', width: 150, renderCell: (params) => (
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    {params.row.transactionAccount?.bank}
                </Box>
            )
        },
        {
            field: 'account', headerName: 'Account', width: 120, renderCell: (params) => (
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    {params.row.transactionAccount?.accountNumber}
                </Box>
            )
        },
        {
            field: 'amount', headerName: 'Funds', width: 120, renderCell: (params) => (
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    {params.row.amount} {params.row.currency}
                </Box>
            )
        },
        { field: 'transactionType', headerName: 'Type', width: 120 },
        {
            field: 'transactionStatus', headerName: 'Status', width: 120, renderCell: (params) => {
                let type = statusColor.pending;
                const transaction = params.row;
                if (transaction.transactionStatus === "PENDING") type = statusColor.in_progress;
                if (transaction.transactionStatus === "CANCEL") type = statusColor.pending;
                if (transaction.transactionStatus === "FAILED") type = statusColor.error;
                if (transaction.transactionStatus === "COMPLETED") type = statusColor.completed;
                if (transaction.transactionStatus === "REFUNDED") type = statusColor.refunded;
                if (transaction.transactionStatus === "CLOSE") type = statusColor.close;
                return (
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                        }}
                    >
                        <Chip
                            label={transaction.transactionStatus}
                            color={type}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                )
            }
        },
    ];

    const handleTypeChange = (type) => (event) => {
        setSelectedType(
            event.target.checked
                ? type
                : null
        );
    };

    const handlePeriodChange = (type) => (event) => {
        setSelectedPeriod(
            event.target.checked
                ? type
                : null
        );
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Reports
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexDirection: { md: 'row', xs: 'column' } }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                    <FormGroup row>
                        {['Withdrawal', 'Deposit'].map((type) => (
                            <FormControlLabel
                                key={type}
                                control={
                                    <Checkbox
                                        checked={type === selectedType}
                                        onChange={handleTypeChange(type)}
                                    />
                                }
                                label={type}
                            />
                        ))}
                    </FormGroup>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormGroup row>
                        {['Daily', 'Weekly', 'Monthly'].map((type) => (
                            <FormControlLabel
                                key={type}
                                control={
                                    <Checkbox
                                        checked={type === selectedPeriod}
                                        onChange={handlePeriodChange(type)}
                                    />
                                }
                                label={type}
                            />
                        ))}
                    </FormGroup>
                    <IconButton>
                        <FileDownloadIcon />
                    </IconButton>
                </Box>
            </Box>

            <DataGrid
                rows={reports}
                columns={columns}
                pageSize={query.size}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                hideFooter
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={pagination?.totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </Box>
    );
}
