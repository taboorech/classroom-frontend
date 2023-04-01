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

export const deleteElements = createAsyncThunk(
  'lessonInfo/deleteElements',
  async (data, { rejectWithValue }) => {
    return await mainInstance.post(`/classes/${data.id}/${data.lessonId}/turnIn?operation=DELETE_ELEMENTS`, {
      attachedElements: data.attachedElements.get('attachedElements')
    }, {
      headers: { "content-type": "multipart/form-data" }
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const turnIn = createAsyncThunk(
  'lessonInfo/turnIn',
  async (data, { rejectWithValue }) => {
    return await mainInstance.post(`/classes/${data.id}/${data.lessonId}/turnIn?operation=TURN_IN`)
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const cancel = createAsyncThunk(
  'lessonInfo/cancel',
  async (data, { rejectWithValue }) => {
    return await mainInstance.post(`/classes/${data.id}/${data.lessonId}/turnIn?operation=CANCEL`)
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
    .addCase(deleteElements.fulfilled, (state, action) => {
      state.userElements = {...action.payload};
    })
    .addCase(deleteElements.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(turnIn.fulfilled, (state, action) => {
      state.userElements = {...action.payload};
    })
    .addCase(turnIn.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(cancel.fulfilled, (state, action) => {
      state.userElements = {...action.payload};
    })
    .addCase(cancel.rejected, (state, action) => {
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