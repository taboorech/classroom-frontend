import { createSlice } from '@reduxjs/toolkit'

export const createFormSlice = createSlice({
  name: 'createForm',
  initialState: {
    open: false
  },
  reducers: {
    openForm: (state) => {
      state.open = !state.open;
    }
  },
})

export const { openForm } = createFormSlice.actions;

export default createFormSlice.reducer;