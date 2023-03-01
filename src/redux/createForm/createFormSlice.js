import { createSlice } from '@reduxjs/toolkit'

export const createFormSlice = createSlice({
  name: 'createForm',
  initialState: {
    open: false
  },
  reducers: {
    openForm: (state) => {
      state.open = !state.open;
    },
    closeForm: (state) => {
      state.open = false;
    }
  },
})

export const { openForm, closeForm } = createFormSlice.actions;

export default createFormSlice.reducer;