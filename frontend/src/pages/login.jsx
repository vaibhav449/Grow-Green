import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { login } from '../services/user'; // Import the login function from user service
import { loginSuccess, selectUserRole } from '../redux/store/slices/authSlice';
import { useDispatch ,useSelector} from 'react-redux';

// --- Login Component ---
// This component handles user login and navigates to a different page on success.
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // 2. Initialize the navigate function
    const dispatch=useDispatch();
    const userRole= useSelector(selectUserRole);

    // Handles the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response =await login({ email, password });

        
        if(response.success==false) {
            setError(response.error || 'Login failed. Please try again.');
            return;
        }
        console.log("response", response.data);
        console.log("response", typeof response.data);
        dispatch(loginSuccess(response.data));
        {userRole === 'admin' ?
            navigate('/adminHome') :
            navigate('/')}
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Login Page
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in to continue
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Display error message if any */}
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
}
