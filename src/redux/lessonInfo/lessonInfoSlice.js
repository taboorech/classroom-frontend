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

export const uploadFiles = createAsyncThunk(
  'lessonInfo/uploadFiles',
  async (data, { rejectWithValue }) => {
    console.log(data);
    return await mainInstance.post(`/classes/${data.id}/${data.lessonId}/turnIn?operation=UPLOAD`, {
      files: data.files ? data.files.get('files') : null,
      attachedElements: data.attachedElements ? data.attachedElements.get('attachedElements') : null
    }, {
      headers: { "content-type": "multipart/form-data" }
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const lessonInfo = createSlice({
  name: 'lessonInfo',
  initialState: {
    urlInput: '',
    error: []
  },
  reducers: {
    changeURLInput: (state, action) => {
      state.urlInput = action.payload;
    }
  },
  extraReducers: builder => {
    builder
    .addCase(getLessonInfo.fulfilled, (state, action) => {
      state.lesson = {...action.payload.lesson};
      state.marks = {...action.payload.marks};
      state.userElements = {...action.payload.userElements};
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
    .addCase(uploadFiles.fulfilled, (state, action) => {
      state.userElements = {...action.payload};
    })
    .addCase(uploadFiles.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
  }
})

export const { changeURLInput } = lessonInfo.actions;

export default lessonInfo.reducer;