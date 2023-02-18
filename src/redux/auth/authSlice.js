import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mainInstance from '../../api/mainInstance'

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data, { rejectWithValue }) => {
    return await mainInstance.post('/auth/signIn', {
      email: data.email,
      password: data.password
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message));
  }
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data, { rejectWithValue }) => {
    return await mainInstance.put('/auth/signUp', {
      email: data.email,
      login: data.login,
      password: data.password
    })
    .then((response) => response.data)
    .catch((error) => rejectWithValue(error.response.data.message));
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    return await mainInstance.get('/auth/logout')
    .then((response) => response.data)
    .catch((error) => error)
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: localStorage.getItem('accessToken') ? true : false,
    email: '',
    regEmail: '',
    password: '',
    regPassword: '',
    confirmPassword: '',
    regLogin: '',
    error: []
  },
  reducers: {
    changeEmail: (state, action) => {
      state.email = action.payload;
    },
    changeRegEmail: (state, action) => {
      state.regEmail = action.payload;
    },
    changePassword: (state, action) => {
      state.password = action.payload;
    },
    changeRegPassword: (state, action) => {
      state.regPassword = action.payload;
    },
    changeConfirmPassword: (state, action) => {
      state.confirmPassword = action.payload;
    },
    changeRegLogin: (state, action) => {
      state.regLogin = action.payload;
    },
  },
  extraReducers: builder => {
    builder
    .addCase(signIn.fulfilled, (state, action) => {
      state.isAuth = true;
      state.email = '';
      state.regEmail = '';
      state.password = '';
      state.regPassword = '';
      state.confirmPassword = '';
      state.regLogin = '';
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      
    })
    .addCase(signIn.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error.push(action.payload);
      }
    })
    .addCase(signUp.fulfilled, (state, action) => {
      state.email = '';
      state.regEmail = '';
      state.password = '';
      state.regPassword = '';
      state.confirmPassword = '';
      state.regLogin = '';
    })
    .addCase(signUp.rejected, (state, action) => {
      if(Array.isArray(action.payload) && action.payload.length > 1) {
        state.error = [...action.payload];
      } else {
        state.error.push(action.payload);
      }
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.isAuth = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    })
  }
})

export const { changeEmail, changeRegEmail, changePassword, changeRegPassword, changeConfirmPassword, changeRegLogin } = authSlice.actions;

export default authSlice.reducer;