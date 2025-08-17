// File: Cart.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa';
import {
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
} from '../redux/store/slices/cart/cartSelector';
import { clearCart, increment, decrement, setItemQuantity } from '../redux/store/slices/cart/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems) || [];
  const itemCount = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  const handleClear = (e) => {
    e?.preventDefault?.();
    dispatch(clearCart());
  };

  function handleAdd(item) {
    dispatch(increment( item.id ));
  }

  function handleRemove(item) {
    dispatch(decrement( item.id ));
  }

  function handleQuantityChange(item, rawValue) {
    // ensure number and min 1
    const qty = Number(rawValue);
    if (Number.isNaN(qty) || qty < 1) return;
    dispatch(setItemQuantity({ id: item.id, quantity: Math.floor(qty) }));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={handleClear}
                className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
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
                  {cartItems.map((item) => (
                    <div
                      key={item.id ?? `${item.name}-${item.price}`}
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

                        <div className="mt-3 flex items-center justify-between md:justify-start md:space-x-8">
                          <div className="text-gray-700">
                            <span className="text-sm text-gray-500">Price </span>
                            <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                          </div>

                          <div className="text-gray-700">
                            <span className="text-sm text-gray-500">Qty </span>
                            <span className="font-medium" data-testid={`qty-${item.id}`}>{item.quantity ?? 1}</span>
                          </div>

                          <div className="ml-auto md:ml-0 flex items-center">
                            <button
                              aria-label={`increase-${item.id}`}
                              className="px-3 py-1 mr-2 rounded-md border hover:bg-gray-100"
                              onClick={() => handleAdd(item)}
                            >
                              +
                            </button>

                            <input
                              className="w-16 text-center border rounded-md py-1"
                              type="number"
                              min={1}
                              value={item.quantity ?? 1}
                              onChange={(e) => handleQuantityChange(item, e.target.value)}
                            />

                            <button
                              aria-label={`decrease-${item.id}`}
                              className="px-3 py-1 ml-2 rounded-md border hover:bg-gray-100"
                              onClick={() => handleRemove(item)}
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={handleClear}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
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
