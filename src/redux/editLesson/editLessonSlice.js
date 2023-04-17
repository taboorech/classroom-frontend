import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mainInstance from '../../api/mainInstance';

export const createLesson = createAsyncThunk(
  'editLesson/createLesson',
  async (data, { rejectWithValue }) => {
    return await mainInstance.put(`/classes/${data.id}/createLesson`, data.lesson, {
      headers: { "content-type": "multipart/form-data" }
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const editLessonSlice = createSlice({
  name: 'editLesson',
  initialState: {
    title: '',
    description: '',
    type: '',
    maxMark: '',
    files: [],
    attachedElements: {},
    expires: '',
    error: []
  },
  reducers: {
    changeTitle: (state, action) => {
      state.title = action.payload;
    },
    changeMark: (state, action) => {
      state.maxMark = action.payload;
    },
    changeDescription: (state, action) => {
      state.description = action.payload;
    },
    changeType: (state, action) => {
      state.type = action.payload;
    },
    changeFiles: (state, action) => {
      state.files = action.payload;
    },
    changeAttachments: (state, action) => {
      state.attachedElements[action.payload.id] = action.payload.url;
    },
    changeExpires: (state, action) => {
      state.expires = action.payload;
    }
  },
  extraReducers: builder => {
    builder
    .addCase(createLesson.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
  }
})

export const { changeTitle, changeMark, changeDescription, changeType, changeFiles, changeAttachments, changeExpires } = editLessonSlice.actions;

export default editLessonSlice.reducer;