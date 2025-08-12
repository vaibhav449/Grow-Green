import axios from 'axios';
const api = axios.create( {

    baseURL:'http://localhost:3000'
}
);

export const signup = async (formData) => {
    try {
        console.log("form data",formData);
        
        const response = await api.post('/api/v1/user/signup', formData);
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Signup successful, token:', token);
        return { success: true, data: token };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
};



export const login = async (formData) => {
    try {
        const response = await api.post('/api/v1/user/login', formData);
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Login successful, token:', token);
        return { success: true, data:token};
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
export const adminSignup = async (formData) => {
   
    console.log("admin signup called with data:", formData);
    try {
        const response = await api.post('/api/v1/admin/signup', formData);
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Admin Signup successful, token:', token);
        return { success: true, data: token };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}




