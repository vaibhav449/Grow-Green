import axios from 'axios';
const api=axios.create({
    baseURL: 'http://localhost:3000'
});
export const getAllProducts = async ()=>{
    try {
        const response = await api.get('/api/v1/products');
        console.log('Fetched products:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        return { success: false, error: error.message };
    }
}
export const getSelectedProducts = async (searchObj) => {
    try {
        const response = await api.get('/api/v1/products', {
            params: searchObj // Axios automatically formats this into query params
        });
        console.log('Fetched products:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        return { success: false, error: error.message };
    }
};
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/api/v1/products/${id}`);
        console.log('Product fetched by ID:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
        return { success: false, error: error.message };
    }
};