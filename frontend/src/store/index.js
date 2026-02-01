import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authApi/auth.slice';
import friendsReducer from './friendsApi/friends.slice';
import messagesReducer from './messageApi/message.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    messages: messagesReducer,
  },
});
