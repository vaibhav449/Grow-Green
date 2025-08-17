import { createSlice } from '@reduxjs/toolkit';

// item shape we expect: { id, name, price, imageUrl, variant?, ... }

const initialState = {
  items: [], // each item: { id, name, price, quantity, ... }
};

const findIndexById = (items, id) => items.findIndex(i => i.id === id);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      // payload: { id, name, price, ... , quantity: optional }
      const payload = action.payload;
      const qtyToAdd = payload.quantity ? Number(payload.quantity) : 1;
      const idx = findIndexById(state.items, payload.id);
      const imageUrl=payload.imageUrl || ''; // default to empty string if not provided
      const description=payload.description || ''; // default to empty string if not provided
      if (idx >= 0) {
        // merge quantities
        state.items[idx].quantity += qtyToAdd;
      } else {
        state.items.push({ ...payload, quantity: qtyToAdd, imageUrl, description });
      }
    },

    removeItem(state, action) {
      // payload: id
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    setItemQuantity(state, action) {
      // payload: { id, quantity }
      const { id, quantity } = action.payload;
      const idx = findIndexById(state.items, id);
      if (idx >= 0) {
        state.items[idx].quantity = Math.max(0, Number(quantity));
        // optionally remove if zero
        if (state.items[idx].quantity === 0) {
          state.items.splice(idx, 1);
        }
      }
    },

    increment(state, action) {
      const idx = findIndexById(state.items, action.payload);
      if (idx >= 0) state.items[idx].quantity += 1;
    },

    decrement(state, action) {
      const idx = findIndexById(state.items, action.payload);
      if (idx >= 0) {
        state.items[idx].quantity -= 1;
        if (state.items[idx].quantity <= 0) state.items.splice(idx, 1);
      }
    },

    clearCart(state) {
      state.items = [];
    },

    // hydrate from persisted storage (payload: { items: [...] })
    loadCart(state, action) {
      state.items = action.payload.items || [];
    }
  }
});

export const {
  addItem,
  removeItem,
  setItemQuantity,
  increment,
  decrement,
  clearCart,
  loadCart
} = cartSlice.actions;

export default cartSlice.reducer;
