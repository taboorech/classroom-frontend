import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mainInstance from '../../api/mainInstance'

export const getLessonInfo = createAsyncThunk(
  'lessonInfo/getLesson',
  async (data, { rejectWithValue }) => {
    return await mainInstance.get(`/classes/${data.id}/${data.lessonId}`)
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const lessonInfo = createSlice({
  name: 'lessonInfo',
  initialState: {
    info: {},
    error: []
  },
  reducers: {
    
  },
  extraReducers: builder => {
    builder
    .addCase(getLessonInfo.fulfilled, (state, action) => {
      state.info = {...action.payload};
      state.error = [];
    })
    .addCase(getLessonInfo.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
  }
})

// export const { } = classesSlice.actions;

export default lessonInfo.reducer;