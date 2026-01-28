import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authApi/auth.slice';
import friendsReducer from './friendsApi/friends.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
  },
});
