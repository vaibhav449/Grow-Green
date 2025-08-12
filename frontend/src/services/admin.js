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

}