import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mainInstance from '../../api/mainInstance'

export const getLessonWorks = createAsyncThunk(
  'lessonCheck/getLessonWorks',
  async (data, { rejectWithValue }) => {
    return await mainInstance.get(`/classes/${data.id}/${data.lessonId}/works`)
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const lessonCheck = createSlice({
  name: 'lessonCheck',
  initialState: {
    buttonState: 'return',
    members: [],
    lesson: {},
    marks: [],
    works: [],
    turnIn: false,
    error: []
  },
  reducers: {
    changeMark: (state, action) => {
      state[action.payload.id] = action.payload.value;
    },
    changeButtonState: (state, action) => {
      state.buttonState = action.payload;
    },
    changeTurnIn: (state, action) => {
      state.turnIn = action.payload.value;
      const works = state.works;
      works.map((work) => (
        work.user._id === action.payload.userId ? work.turnIn = action.payload.value : null
      ))
      state.works = works;
    },
    changeStateMark: (state, action) => {
      const marks = state.marks;
      marks.push({
        mark: action.payload.mark,
        user: action.payload.userId
      })
      state.marks = marks;
    },
    returnWorkState: (state, action) => {
      const works = state.works;
      works.map((work) => (
        work.user._id === action.payload.userId ? work.turnIn = false : null
      ))
      let marks = state.marks;
      marks = marks.filter((mark) => mark.user !== action.payload.userId);
      state.works = works;
      state.marks = marks;
    }
  },
  extraReducers: builder => {
    builder
    .addCase(getLessonWorks.fulfilled, (state, action) => {
      state.members = [...action.payload.members];
      state.lesson = {...action.payload.lesson};
      state.marks = [...action.payload.marks];
      state.works = [...action.payload.works];
      state.members.map((member) => {
        const mark = state.marks.find((mark) => mark.user === member._id);
        if(!!mark) {
          return state[`mark${member._id}Value`] = mark.mark;
        } else {
          return state[`mark${member._id}Value`] = '';
        }
      })
    })
    .addCase(getLessonWorks.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
  }
})

export const { changeMark, changeTurnIn, changeButtonState, changeStateMark, returnWorkState } = lessonCheck.actions;

export default lessonCheck.reducer;