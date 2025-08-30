import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddProduct from '../pages/AddProduct';
import { getProductById } from '../services/product'; 
const EditProductWrapper = () => {
    const { id } = useParams();
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await getProductById(id);
                console.log("response : ",response);
                setProductData(response);
            } catch (err) {
                setError('Failed to fetch product data');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

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
                </div>
            </div>
        );
    }

    return <AddProduct productData={productData} isEditMode={true} />;
};

export default EditProductWrapper;