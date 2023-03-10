import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mainInstance from '../../api/mainInstance'

export const getClasses = createAsyncThunk(
  'classes/getClasses',
  async (data, { rejectWithValue }) => {
    return await mainInstance.get('/classes')
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (data, { rejectWithValue }) => {
    return await mainInstance.put('/classes/create', {
      title: data.title,
      description: data.description
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const connectToClass = createAsyncThunk(
  'classes/connectToClass',
  async (data, { rejectWithValue }) => {
    return await mainInstance.post(`/classes/connect?accessToken=${data.accessToken}`)
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message))
  }
)

export const classesSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    createClassTitle: '',
    createClassDescription: '',
    accessTokenInput: '',
    error: []
  },
  reducers: {
    setData: (state, action) => {
      action.payload.map((obj) => {
        return state.classes.push(obj);
      })
    },
    changeTitle: (state, action) => {
      state.createClassTitle = action.payload;
    },
    changeDesription: (state, action) => {
      state.createClassDescription = action.payload;
    },
    changeAccessTokenInput: (state, action) => {
      state.accessTokenInput = action.payload;
    },
    clearErrors: (state) => {
      state.error = [];
    }
  },
  extraReducers: builder => {
    builder
    .addCase(getClasses.fulfilled, (state, action) => {
      state.classes = [...action.payload];
      state.error = [];
    })
    .addCase(getClasses.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(createClass.fulfilled, (state, action) => {
      state.createClassTitle = '';
      state.createClassDescription = '';
      state.classes.push({...action.payload});
    })
    .addCase(createClass.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
    .addCase(connectToClass.fulfilled, (state, action) => {
      state.classes.push({...action.payload});
    })
    .addCase(connectToClass.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error = [];
        state.error.push(action.payload);
      }
    })
  }
})

export const { setData, changeTitle, changeDesription, changeAccessTokenInput, clearErrors } = classesSlice.actions;

export default classesSlice.reducer;