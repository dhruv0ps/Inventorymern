
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../componenets/Sidebar';

const UserRegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!username || !email || !password) {
            setError('All fields are required.');
            return;
        }

        setLoading(true); 

        try {
            const response = await axios.post('http://localhost:5000/api/users', {
                username,
                email,
                password,
                role,
                phoneNumber,
            });
            alert(response.data.message);
        
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setRole('user');
            setPhoneNumber('');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
       <Sidebar/>
        <div className="p-6 bg-gray-100 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Register New User</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="phone">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        placeholder="Optional"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="confirm-password">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="superadmin">Super Admin</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    className={`bg-teal-600 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading} 
                >
                    {loading ? 'Registering...' : 'Register User'}
                </button>
            </form>
        </div>
        </>
    );
};

export default UserRegistrationForm;
