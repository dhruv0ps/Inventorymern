import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
    const navigate = useNavigate(); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            setToken(response.data.token);
            const { token } = response.data;
            localStorage.setItem('token', token);

            alert('Login successful');
            navigate('/'); 
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Super Admin Login</h2>
                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
