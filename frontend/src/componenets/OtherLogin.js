import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OtherLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/profilelogin`, {
                email,
                password
            });

            if (response.data.message === "Login successful") { 
                alert('Login successful');
                const userId = response.data.userId;
                navigate(`/profile/${userId}`);
            } else {
                alert('Login failed: ' + response.data.message); 
            }
        } catch (error) {
            console.error("Login error:", error);
            alert('An error occurred during login. Please try again.');
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-10 rounded-lg ml-96 shadow-2xl w-full max-w-xl h-96'>
                <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                        <input 
                            id='email'
                            className='w-full px-4 py-3 border border-gray-300 rounded-md' 
                            type='text' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder='Enter your email' 
                            required 
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
                        <input 
                            id='password'
                            className="w-full px-4 py-3 border border-gray-300 rounded-md" 
                            onChange={(e) => setPassword(e.target.value)} 
                            type="password" 
                            value={password} 
                            placeholder='Enter your password' 
                            required 
                        />
                    </div>
                    <button type='submit' className='w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200'>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default OtherLogin;