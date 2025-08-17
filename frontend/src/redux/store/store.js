// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from '../store/slices/cart/cartSlice';

const CART_LS_KEY = 'myapp_cart_v1';

const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(CART_LS_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load cart from localStorage', e);
    return undefined;
  }
};

const saveToLocalStorage = state => {
  try {
    const toSave = {
      cart: { items: state.cart.items },
      auth: state.auth
    };
    localStorage.setItem(CART_LS_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
};

const preloaded = loadFromLocalStorage();


export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer
  },
  preloadedState: preloaded,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
// subscribe for persistence (debounce in real app)
store.subscribe(() => {
  saveToLocalStorage(store.getState());
});