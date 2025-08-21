import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa';
import {
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
} from '../redux/store/slices/cart/cartSelector';
import {
  clearCart,
  updateItemQuantity,
  fetchCart,
  removeItem,
} from '../redux/store/slices/cart/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const cartItems = useSelector(selectCartItems) || [];
  const itemCount = useSelector(selectCartCount) || 0;
  const subtotal = useSelector(selectCartSubtotal) || 0;

  // Local quantities for UI updates
  const [quantities, setQuantities] = useState({});

  // Initialize quantities from cart items
  useEffect(() => {
    const newQuantities = {};
    cartItems.forEach(item => {
      const id = item.p_id || item._id || item.id;
      newQuantities[id] = item.qty || item.quantity || 1;
    });
    setQuantities(newQuantities);
  }, [cartItems]);

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 1) return;
    
    setQuantities({
      ...quantities,
      [id]: qty
    });
  };

  // Update quantity in backend
  const handleUpdateQuantity = async (id) => {
    if (!quantities[id]) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await dispatch(updateItemQuantity({ 
        id, 
        qty: quantities[id] 
      })).unwrap();
    } catch (err) {
      setError('Failed to update quantity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await dispatch(removeItem(id)).unwrap();
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await dispatch(clearCart()).unwrap();
    } catch (err) {
      setError('Failed to clear cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <FaShoppingCart className="text-white mr-3 text-2xl" />
              <div>
                <h1 className="text-2xl font-bold text-white">Your Cart</h1>
                <p className="text-green-100 mt-1 text-sm">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} — Review your selection
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleClearCart}
                disabled={loading || cartItems.length === 0}
                className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                <FaTrashAlt className="mr-2" />
                Clear cart
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="mx-auto w-40 h-40 rounded-full bg-green-50 flex items-center justify-center mb-6">
                  <FaShoppingCart className="text-green-400 text-4xl" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500 mt-2">Add some tasty products to get started.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {cartItems.map((item) => {
                    const itemId = item.p_id || item._id || item.id;
                    const currentQty = item.qty || item.quantity || 1;
                    const localQty = quantities[itemId] || currentQty;
                    
                    return (
                      <div
                        key={itemId}
                        className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 border rounded-lg"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full md:w-32 h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />

                        <div className="flex-1 w-full">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <div className="text-gray-700">
                              <span className="text-sm text-gray-500">Price: </span>
                              <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                            </div>

                            <div className="text-gray-700">
                              <span className="text-sm text-gray-500">Current Qty: </span>
                              <span className="font-medium">{currentQty}</span>
                            </div>

                            <div className="flex items-center">
                              <button
                                className="px-3 py-1 rounded-l-md border hover:bg-gray-100"
                                onClick={() => handleQuantityChange(itemId, Math.max(1, localQty - 1))}
                              >
                                -
                              </button>
                              
                              <input
                                className="w-16 text-center border-t border-b py-1"
                                type="number"
                                min="1"
                                value={localQty}
                                onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                              />
                              
                              <button
                                className="px-3 py-1 rounded-r-md border hover:bg-gray-100"
                                onClick={() => handleQuantityChange(itemId, localQty + 1)}
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => handleUpdateQuantity(itemId)}
                              disabled={loading || localQty === currentQty}
                              className="px-3 py-1 rounded-md border bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                            >
                              {localQty === currentQty ? 'Updated' : 'Update'}
                            </button>

                            <button
                              onClick={() => handleRemoveItem(itemId)}
                              disabled={loading}
                              className="px-3 py-1 rounded-md border bg-red-50 hover:bg-red-100 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal & Actions */}
                <div className="mt-6 pt-6 border-t flex flex-col md:flex-row items-center justify-between">
                  <div className="text-gray-700">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-2xl font-bold text-gray-900">${Number(subtotal).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Taxes and shipping calculated at checkout</p>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <button
                      onClick={() => alert('Proceed to checkout (not implemented)')}
                      disabled={loading || cartItems.length === 0}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={handleClearCart}
                      disabled={loading || cartItems.length === 0}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}