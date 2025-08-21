import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../services/product";
import { addItem } from "../redux/store/slices/cart/cartSlice";
import { selectIsAuthenticated, selectUserRole } from "../redux/store/slices/authSlice";
import { FaShoppingCart, FaLeaf, FaSeedling, FaArrowLeft } from "react-icons/fa";

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response);
        console.log("Product details fetched:", response);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    
    if (userRole === "admin") {
      alert("Admins cannot add products to cart");
      return;
    }

    dispatch(addItem({ p_id: id, qty: quantity }));
    setAddedToCart(true);
    
    // Reset added to cart message after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate("/shop")}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/shop")}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-500 hover:text-green-500 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to products
          </button>
        </div>

        {/* Product info */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product image */}
          <div className="lg:max-w-lg lg:self-start">
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover object-center"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
                }}
              />
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3">
              <p className="text-3xl text-gray-900 font-bold">${product.price.toFixed(2)}</p>
            </div>

            <div className="mt-3">
              <div className="flex items-center">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.stock}`}
                </div>
                <div className="ml-3 px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                  {product.category}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-4 font-medium text-sm ${activeTab === "description" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-4 font-medium text-sm ${activeTab === "details" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Details
                </button>
                
              </div>
            </div>

            <div className="mt-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}
              
              {activeTab === "details" && (
                <div className="space-y-4">
                  <div className="flex border-b pb-2">
                    <span className="w-1/3 font-medium text-gray-500">Category:</span>
                    <span className="w-2/3 text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex border-b pb-2">
                    <span className="w-1/3 font-medium text-gray-500">Stock:</span>
                    <span className="w-2/3 text-gray-900">{product.stock} units</span>
                  </div>
                  <div className="flex border-b pb-2">
                    <span className="w-1/3 font-medium text-gray-500">Product ID:</span>
                    <span className="w-2/3 text-gray-900">{id}</span>
                  </div>
                </div>
              )}
              
              {activeTab === "care" && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaLeaf className="text-green-500 mr-2" />
                    <span>Water regularly, allowing soil to dry between waterings</span>
                  </div>
                  <div className="flex items-center">
                    <FaSeedling className="text-green-500 mr-2" />
                    <span>Place in bright, indirect sunlight</span>
                  </div>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <div className="mt-8">
              {!isOutOfStock && (
                <div className="flex items-center space-x-4">
                  <div className="flex border border-gray-300 rounded">
                    <button 
                      onClick={decreaseQuantity}
                      className="px-4 py-2 border-r border-gray-300 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 text-center py-2 border-none focus:outline-none"
                    />
                    <button 
                      onClick={increaseQuantity}
                      className="px-4 py-2 border-l border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || addedToCart}
                    className={`flex items-center px-6 py-3 rounded-md text-white font-medium
                      ${addedToCart 
                        ? 'bg-green-700 cursor-default'
                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                      }
                    `}
                  >
                    <FaShoppingCart className="mr-2" />
                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                </div>
              )}

              {isOutOfStock && (
                <button
                  disabled
                  className="w-full px-6 py-3 rounded-md text-white font-medium bg-gray-400 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related products section could be added here */}
      </div>
    </div>
  );
}

export default ViewProduct;