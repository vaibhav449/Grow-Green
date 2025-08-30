import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:3000'
});

export const addProduct = async (formData)=> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found, please login as admin');
        }
        const response = await api.post('/api/v1/admin/addProduct', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Product added successfully:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error adding product:', error.message);
        return { success: false, error: error.message };
    }

};

export const getProductsByOwner = async (ownerId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found, please login as admin');
        }
        
        console.log('Making request with token:', token.substring(0, 20) + '...');
        console.log('Owner ID:', ownerId);
        
        const response = await api.get(`/api/v1/admin/products/${ownerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by owner:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found, please login as admin');
        }
        
        await api.put(`/api/v1/admin/products/${productId}`, productData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        return ;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found, please login as admin');
        }

        await api.delete(`/api/v1/admin/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};