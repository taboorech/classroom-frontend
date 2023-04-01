import { configureStore } from '@reduxjs/toolkit';
import classesReducer from '../classes/classesSlice';
import createFormReducer from '../createForm/createFormSlice';
import authReducer from '../auth/authSlice';
import classInfoReducer from '../classInfo/classInfoSlice';
import QRReducer from '../QR/QRSlice';
import lessonInfoReducer from '../lessonInfo/lessonInfoSlice';
import lessonCheckReducer from '../lessonCheck/lessonCheckSlice';

export default configureStore({
  reducer: {
    classes: classesReducer,
    createForm: createFormReducer,
    auth: authReducer,
    classInfo: classInfoReducer,
    lessonInfo: lessonInfoReducer,
    lessonCheck: lessonCheckReducer,
    QRForm: QRReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})