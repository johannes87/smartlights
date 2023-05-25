import { configureStore } from '@reduxjs/toolkit';
import lightsReducer from './slices/lightsSlice';

export default configureStore({
  reducer: {
    lights: lightsReducer,
  },
});
