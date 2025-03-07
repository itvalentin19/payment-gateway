import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reports: [
    { id: 1, date: '2024-03-01', name: 'Daily Summary', funds: '$15,000', type: 'Daily', status: 'Completed' },
    { id: 2, date: '2024-03-08', name: 'Weekly Analysis', funds: '$105,000', type: 'Weekly', status: 'Pending' },
    { id: 3, date: '2024-03-15', name: 'Monthly Overview', funds: '$450,000', type: 'Monthly', status: 'Processing' },
    { id: 4, date: '2024-03-02', name: 'Daily Transactions', funds: '$18,500', type: 'Daily', status: 'Completed' },
    { id: 5, date: '2024-03-09', name: 'Weekly Audit', funds: '$98,000', type: 'Weekly', status: 'Completed' },
    { id: 6, date: '2024-03-16', name: 'Monthly Financials', funds: '$520,000', type: 'Monthly', status: 'Pending' },
  ],
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
});

export default reportsSlice.reducer;
