import React, { useState, useEffect } from 'react';
import { getProductsByOwner } from '../services/admin';
import { useSelector } from 'react-redux'; // Fixed import
import { selectToken } from '../redux/store/slices/authSlice';
import { FaEdit, FaTrash, FaPlus, FaBox, FaDollarSign, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { deleteProduct } from '../services/admin';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const token = useSelector(selectToken);
    
    // Add error handling for token decoding
    let userId = null;
    try {
        if (token) {
            const decoded = jwtDecode(token);
            userId = decoded._id || decoded.id;
        }
    } catch (err) {
        console.error('Token decode error:', err);
        setError('Invalid token. Please login again.');
    }

    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getProductsByOwner(userId); 
                console.log("response : ",response);
                setProducts(response.products || []);
            } catch (err) {
                setError('Failed to fetch your products. Please try again.');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchMyProducts();
        } else if (!token) {
            setError('Please login to view your products.');
            setLoading(false);
        }
    }, [userId, token]);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                // Add delete functionality here
                await deleteProduct(productId);
                setProducts(products.filter(product => product._id !== productId));
                alert('Product deleted successfully!');
            } catch (error) {
                alert('Failed to delete product');
                console.error('Delete error:', error);
            }
        }
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
                    <h2 className="font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                            <p className="text-gray-600 mt-2">
                                Manage your product inventory • {products.length} product{products.length !== 1 ? 's' : ''} total
                            </p>
                        </div>
                        <Link
                            to="/admin/add-product"
                            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            <FaPlus className="mr-2" />
                            Add New Product
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <FaBox className="text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <FaDollarSign className="text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Value</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${products.reduce((sum, product) => sum + (product.price * product.stock), 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FaTag className="text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Set(products.map(p => p.category)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FaBox className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                        <p className="text-gray-500 mb-6">Start by adding your first product to the inventory.</p>
                        <Link
                            to="/admin/add-product"
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            <FaPlus className="mr-2" />
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Product Image */}
                                <div className="h-48 overflow-hidden">
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                                        {product.name}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    {/* Price and Stock */}
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-2xl font-bold text-green-600">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            product.stock > 10 ? 'bg-green-100 text-green-800' :
                                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-4">
                                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/admin/editProduct/${product._id}`}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                        >
                                            <FaEdit className="mr-1" />
                                            Edit
                                        </Link>
                                        
                                        <button
                                            onClick={() => handleDeleteProduct(product._id)}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                        >
                                            <FaTrash className="mr-1" />
                                            Delete
                                        </button>
                                    </div>

                                    {/* View Details */}
                                    <Link
                                        to={`/products/${product._id}`}
                                        className="block mt-2 w-full text-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProducts;