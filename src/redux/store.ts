import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import diagnosticReducer from './slices/diagnosticSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diagnostic: diagnosticReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;