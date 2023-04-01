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

export const deleteClass = createAsyncThunk(
  'classInfo/delete',
  async (data, { rejectWithValue }) => {
    return await mainInstance.delete(`/classes/${data.id}`)
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const addOwner = createAsyncThunk(
  'classInfo/addOwner',
  async (data, { rejectWithValue }) => {
    return await mainInstance.patch(`/classes/${data.id}/addOwner`, {
      owners: data.userId
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const removeOwner = createAsyncThunk(
  'classInfo/removeOwner',
  async (data, { rejectWithValue }) => {
    return await mainInstance.patch(`/classes/${data.id}/removeOwner`, {
      owners: data.userId
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const removeFromClassroom = createAsyncThunk(
  'classInfo/removeFromClassroom',
  async (data, { rejectWithValue }) => {
    return await mainInstance.patch(`/classes/${data.id}/removeMember`, {
      memberId: data.userId
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const getMarks = createAsyncThunk(
  'classInfo/getMarks',
  async (data, { rejectWithValue }) => {
    return await mainInstance.get(`/classes/${data.id}/gradeBook`)
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const makeAssessment = createAsyncThunk(
  'classInfo/makeAssessment',
  async (data, { rejectWithValue }) => {
    return await mainInstance.put(`/classes/${data.id}/${data.lessonId}/marks`, {
      memberId: data.memberId,
      mark: data.mark
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const updateAssessment = createAsyncThunk(
  'classInfo/updateAssessment',
  async (data, { rejectWithValue }) => {
    return await mainInstance.patch(`/classes/${data.id}/${data.lessonId}/marks`, {
      markId: data.markId,
      mark: data.mark
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const returnWork = createAsyncThunk(
  'classInfo/returnWork',
  async (data, { rejectWithValue }) => {
    return await mainInstance.patch(`/classes/${data.id}/${data.lessonId}/return`, {
      memberId: data.memberId
    })
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
    titleInput: '',
    descriptionInput: '',
    error: []
  },
  reducers: {
    setOpen: (state, action) => {
      if(state.isOpen === action.payload) {
        state.isOpen = null;
      } else {
        state.isOpen = action.payload;
      }
    },
    changeTitleInput: (state, action) => {
      state.titleInput = action.payload;
    },
    changeDescriptionInput: (state, action) => {
      state.descriptionInput = action.payload;
    },
    changeMark: (state, action) => {
      state[action.payload.id] = action.payload.value;
    }
  },
  extraReducers: builder => {
    builder
    .addCase(getClassInfo.fulfilled, (state, action) => {
      state.info = {...action.payload.classObj};
      state.titleInput = action.payload.classObj.title;
      state.descriptionInput = action.payload.classObj.description;
      state.owner = action.payload.owner;
      state.error = [];
    })
    .addCase(getClassInfo.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(deleteClass.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(addOwner.fulfilled, (state, action) => {
      for(let i = 0; i < state.info.members.length; i++) {
        for(let j = 0; j < action.payload.owners.length; j++) {
          if(state.info.members[i]._id === action.payload.owners[j]) {
            state.info.owners.push(state.info.members[i]);
            state.info.members.splice(i, 1);
          }
        }
      }
    })
    .addCase(addOwner.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(removeOwner.fulfilled, (state, action) => {
      for(let i = 0; i < state.info.owners.length; i++) {
        for(let j = 0; j < action.payload.members.length; j++) {
          if(state.info.owners[i]._id === action.payload.members[j]) {
            state.info.members.push(state.info.owners[i]);
            state.info.owners.splice(i, 1);
          }
        }
      }
    })
    .addCase(removeOwner.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(removeFromClassroom.fulfilled, (state, action) => {
      let tempArr = [];
      for(let i = 0; i < state.info.members.length; i++) {
        for(let j = 0; j < action.payload.members.length; j++) {
          if(state.info.members[i]._id === action.payload.members[j]._id) {
            tempArr.push(i);
          }
        }
      }
      state.info.members = state.info.members.filter((obj, index) => tempArr.includes(index));
      // state.info.members = state.info.members.filter((member) => action.payload.members.includes(member));
    })
    .addCase(removeFromClassroom.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(getMarks.fulfilled, (state, action) => {
      state.info.members.map((member) => {
        return state.info.lessons.map((lesson) => {
          const mark = action.payload.find((mark) => mark.lesson === lesson._id && mark.user === member._id);
          if(!!mark) {
            return state[`mark${lesson._id + member._id}Value`] = mark.mark;
          } else {
            return state[`mark${lesson._id + member._id}Value`] = '';
          }
        })
      })
      state.marks = [...action.payload];
    })
    .addCase(getMarks.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(makeAssessment.fulfilled, (state, action) => {
      if(state.marks) {
        state.marks.push(action.payload);
      }
    })
    .addCase(makeAssessment.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(updateAssessment.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(returnWork.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
  }
})

export const { setOpen, changeTitleInput, changeDescriptionInput, changeMark } = classInfoSlice.actions;

export default classInfoSlice.reducer;