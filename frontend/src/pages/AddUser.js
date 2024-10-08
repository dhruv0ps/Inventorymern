import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [roles, setRoles] = useState([]);

    
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/roles`);
                setRoles(response.data);
                console.log(response.data) 
            } catch (error) {
                console.error('Error fetching roles:', error);
                setError('Failed to fetch roles.');
            }
        };

        fetchRoles(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, {
                username,
                email,
                password,
                role,
            });

            alert(response.data.message);

            
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setRole('user');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md p-6 bg-card shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-semibold text-center mb-6 text-text">Register New User</h2>
            {error && <p className="text-error text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-text">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-text">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-text">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirm-password" className="block text-text">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="role" className="block text-text">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        {roles.map((roleOption) => (
                            <option key={roleOption.id} value={roleOption.name}>
                                {roleOption.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className={`w-full p-3 text-white bg-success rounded shadow-md hover:bg-warning focus:outline-none focus:ring focus:ring-warning ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register User'}
                </button>
            </form>
        </div>
    );
};

export default AddUser;