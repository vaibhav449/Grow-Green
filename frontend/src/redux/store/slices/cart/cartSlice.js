import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../../../services/cart';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const addItem = createAsyncThunk(
  'cart/addItem',
  async (item, { rejectWithValue }) => {
    try {
      return await cartService.addItem(item);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add item');
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (id, { rejectWithValue }) => {
    try {
      await cartService.removeItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.clearCart();
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to clear cart');
    }
  }
);


export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ id, qty }, { rejectWithValue }) => {
    try {
      return await cartService.updateItemQuantity(id, qty);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update quantity');
    }
  }
);



const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {

    getQuantity: (state, action) => {
      const itemId = action.payload;
      const idx = state.items.findIndex(item => item.id === itemId);
      if (idx !== -1) {
        return state.items[idx].quantity;
      }
      return 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add item
      .addCase(addItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Backend should return updated cart
        state.items = action.payload.items;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Remove item
      .addCase(removeItem.fulfilled, (state, action) => {
        // Remove the item from state immediately
        state.items = state.items.filter(item => {
          const itemId = item.p_id || item._id || item.id;
          return itemId !== action.payload; // action.payload is the removed item ID
        });
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update quantity
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        // Backend returns the whole cart with items array
        state.items = action.payload.items;
      })

      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
      })
  }
});

export const { getQuantity } = cartSlice.actions;
export default cartSlice.reducer;