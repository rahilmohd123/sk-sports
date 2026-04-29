import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import adminAuthReducer from './slices/adminAuthSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    adminAuth: adminAuthReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
