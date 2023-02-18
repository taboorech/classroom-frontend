import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mainInstance from '../../api/mainInstance'

export const getClassInfo = createAsyncThunk(
  'classInfo/getInfo',
  async (data, { rejectWithValue }) => {
    return await mainInstance.get(`/classes/${data.id}`)
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const classInfoSlice = createSlice({
  name: 'classInfo',
  initialState: {
    info: {},
    owner: false,
    isOpen: null,
    error: []
  },
  reducers: {
    setOpen: (state, action) => {
      if(state.isOpen === action.payload) {
        state.isOpen = null;
      } else {
        state.isOpen = action.payload;
      }
    }
  },
  extraReducers: builder => {
    builder
    .addCase(getClassInfo.fulfilled, (state, action) => {
      state.info = {...action.payload.classObj};
      state.owner = action.payload.owner;
    })
    .addCase(getClassInfo.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error.push(action.payload);
      }
    })
  }
})

export const { setOpen } = classInfoSlice.actions;

export default classInfoSlice.reducer;