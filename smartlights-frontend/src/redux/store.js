import { configureStore } from '@reduxjs/toolkit';
import globalSnackBarSlice from './slices/globalSnackBarSlice';

export default configureStore({
  reducer: {
    globalSnackBar: globalSnackBarSlice,
  },
});
