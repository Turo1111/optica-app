import { configureStore } from '@reduxjs/toolkit'
import alertSlice from './alertSlice';
import userSlice from './userSlice';

export const store = configureStore({
    reducer: {
        alert: alertSlice,
        user: userSlice
    }
  })

