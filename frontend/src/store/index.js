import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authApi/auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
