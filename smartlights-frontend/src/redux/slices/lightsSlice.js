const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  triggerReloadHack: undefined,
};
export const lightsSlice = createSlice({
  name: 'lights',
  initialState,
  reducers: {
    triggerReload: (state) => {
      state.triggerReloadHack = Date.now();
    },
  },
});

export const { triggerReload } = lightsSlice.actions;

export const selectTriggerReloadHack = (state) =>
  state.lights.triggerReloadHack;

export default lightsSlice.reducer;
