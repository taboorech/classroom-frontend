import { configureStore } from '@reduxjs/toolkit';
import classesReducer from '../classes/classesSlice';
import createFormReducer from '../createForm/createFormSlice';
import authReducer from '../auth/authSlice';
import classInfoReducer from '../classInfo/classInfoSlice';

export default configureStore({
  reducer: {
    classes: classesReducer,
    createForm: createFormReducer,
    auth: authReducer,
    classInfo: classInfoReducer
  },
})