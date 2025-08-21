import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cart/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // You can ignore specific action types if needed
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});