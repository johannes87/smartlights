import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  message: '',
  severity: undefined,
};

export const globalSnackBar = createSlice({
  name: 'globalSnackBar',
  initialState,
  reducers: {
    resetState: () => initialState,
    handleApiError: (state, action) => {
      const { error } = action.payload;
      state.open = true;
      state.message = error;
      state.severity = 'error';
    },
    showSuccess: (state, action) => {
      state.open = true;
      state.message = action.payload;
      state.severity = 'success';
    },
  },
});

export const { resetState, handleApiError, showSuccess } =
  globalSnackBar.actions;

export const selectOpen = (state) => state.globalSnackBar.open;
export const selectMessage = (state) => state.globalSnackBar.message;
export const selectSeverity = (state) => state.globalSnackBar.severity;

export default globalSnackBar.reducer;
