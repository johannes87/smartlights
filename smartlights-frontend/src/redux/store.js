import { configureStore } from '@reduxjs/toolkit';
import globalSnackBarSlice from './slices/globalSnackBarSlice';
import lightsSlice from './slices/lightsSlice';

export default configureStore({
  reducer: {
    globalSnackBar: globalSnackBarSlice,
    lights: lightsSlice,
  },
});
