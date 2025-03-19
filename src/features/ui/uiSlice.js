import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  toast: {
    show: false,
    message: '',
    type: 'info' // can be 'success', 'error', 'warning', 'info'
  },
  modal: {
    show: false,
    title: '',
    description: '',
    cancelText: 'Cancel',
    actionText: 'Update',
    action: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info'
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    showModal: (state, action) => {
      state.modal = {
        show: true,
        title: action.payload.title,
        description: action.payload.description,
        cancelText: action.payload.cancelText || 'Cancel',
        actionText: action.payload.actionText || 'Submit',
        action: action.payload.action
      }
    },
    hideModal: (state) => {
      state.modal.show = false;
      state.modal.action = null;
    }
  }
});

export const { setLoading, showToast, hideToast, showModal, hideModal } = uiSlice.actions;
export const selectLoading = (state) => state.ui.loading;
export const selectToast = (state) => state.ui.toast;
export const selectModal = (state) => state.ui.modal;

export default uiSlice.reducer;
