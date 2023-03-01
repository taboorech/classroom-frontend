import { createSlice } from '@reduxjs/toolkit'

export const QRSlice = createSlice({
  name: 'QR',
  initialState: {
    open: false
  },
  reducers: {
    openQRForm: (state) => {
      state.open = !state.open;
    },
    closeQRForm: (state) => {
      state.open = false;
    }
  },
})

export const { openQRForm, closeQRForm } = QRSlice.actions;

export default QRSlice.reducer;