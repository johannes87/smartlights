import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetState,
  selectMessage,
  selectOpen,
  selectSeverity,
} from 'redux/slices/globalSnackBarSlice';

export default function GlobalSnackBar() {
  const open = useSelector(selectOpen);
  const message = useSelector(selectMessage);
  const severity = useSelector(selectSeverity);

  const dispatch = useDispatch();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => dispatch(resetState())}
    >
      <Alert
        onClose={() => dispatch(resetState())}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
