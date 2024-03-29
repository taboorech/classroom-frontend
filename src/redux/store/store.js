import { configureStore } from '@reduxjs/toolkit';
import classesReducer from '../classes/classesSlice';
import createFormReducer from '../createForm/createFormSlice';
import authReducer from '../auth/authSlice';
import classInfoReducer from '../classInfo/classInfoSlice';
import QRReducer from '../QR/QRSlice';
import lessonInfoReducer from '../lessonInfo/lessonInfoSlice';
import lessonCheckReducer from '../lessonCheck/lessonCheckSlice';
import editLessonReducer from '../editLesson/editLessonSlice';

export default configureStore({
  reducer: {
    classes: classesReducer,
    createForm: createFormReducer,
    auth: authReducer,
    classInfo: classInfoReducer,
    lessonInfo: lessonInfoReducer,
    lessonCheck: lessonCheckReducer,
    editLesson: editLessonReducer,
    QRForm: QRReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})