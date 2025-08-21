import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export const cartService = {
  // Get cart for current user
  async getCart() {
    const response = await api.get('/api/v1/cart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  
  // Add item to cart
  async addItem(item) {
    const response = await api.post('/api/v1/cart/items', item, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  
  // Remove item from cart
  async removeItem(itemId) {
    const response = await api.delete(`/api/v1/cart/items/${itemId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  
  // Update item quantity
  async updateItemQuantity(id, qty) {
    const response = await api.patch(`/api/v1/cart/items/${id}`, { qty }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  
  // Clear cart
  async clearCart() {
    const response = await api.delete('/api/v1/cart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};