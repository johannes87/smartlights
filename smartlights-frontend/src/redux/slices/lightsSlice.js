import { createSlice } from '@reduxjs/toolkit';
import { getLights } from '../../API';

export const lightsSlice = createSlice({
  name: 'lights',
  initialState: {
    lights: {},
  },
  reducers: {
    setLights: (state, action) => {
      state.lights = action.payload;
    },
  },
});

export const { setLights } = lightsSlice.actions;

export const fetchLights = () => async (dispatch) => {
  const lights = await getLights();
  dispatch(setLights(lights));
};

export default lightsSlice.reducer;
