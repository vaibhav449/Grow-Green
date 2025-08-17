import { createSelector } from '@reduxjs/toolkit';

const selectCartSlice = state => state.cart;

export const selectCartItems = createSelector(
  [selectCartSlice],
  cart => cart.items
);

export const selectCartCount = createSelector(
  [selectCartItems],
  items => items.reduce((sum, it) => sum + it.quantity, 0)
);

export const selectCartSubtotal = createSelector(
  [selectCartItems],
  items => items.reduce((sum, it) => sum + (Number(it.price) * it.quantity), 0)
);

// You can add tax, shipping calculations as their own selectors.
export const selectCartTotal = createSelector(
  [selectCartSubtotal],
  subtotal => {
    const shipping = subtotal > 1000 ? 0 : 50; // example
    const tax = subtotal * 0.18;
    return { subtotal, tax, shipping, total: subtotal + tax + shipping };
  }
);
