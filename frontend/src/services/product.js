import axios from 'axios';
const api=axios.create({
    baseURL: 'http://localhost:3000'
});
export const getAllProducts = async ()=>{
    try {
        const response = await api.get('/api/v1/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        return { success: false, error: error.message };
    }
}