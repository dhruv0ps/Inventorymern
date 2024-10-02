import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleActivate = async (userId) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}/activate`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(users.map(user => (user._id === userId ? { ...user, status: 'active' } : user)));
        } catch (error) {
            console.error('Error activating user:', error);
        }
    };

    const handleSuspend = async (userId) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}/suspend`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(users.map(user => (user._id === userId ? { ...user, status: 'suspended' } : user)));
        } catch (error) {
            console.error('Error suspending user:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleRoleChange = (userId) => {
        setSelectedUserId(userId);
        const user = users.find(user => user._id === userId);
        setSelectedRole(user.role);
    };

    const updateRole = async (userId) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}/role`, { role: selectedRole }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(users.map(user => (user._id === userId ? { ...user, role: selectedRole } : user)));
            setSelectedUserId(null);
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const addNewRole = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/roles', { role: newRole }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert(response.data.message);
            setNewRole('');
        } catch (error) {
            console.error('Error adding new role:', error);
        }
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        
       <div className="w-full  mx-auto p-6 bg-white shadow-lg  rounded-lg">
            <h2 className="text-2xl font-bold mb-4  mt-2 text-center">User List</h2>
            <form onSubmit={addNewRole} className="mb-4 flex items-center justify-center">
                <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="New Role"
                    className="border border-gray-300 p-2 rounded mr-2"
                    required
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300">Add Role</button>
            </form>
            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border border-gray-300 p-2">Username</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Role</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className={`border-b ${user.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                            <td className="border border-gray-300 p-2">{user.username}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2">{user.status}</td>
                            <td className="border border-gray-300 p-2">
                                {selectedUserId === user._id ? (
                                    <div>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="border border-gray-300 p-1 rounded"
                                        >
                                            <option value="superadmin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                            <option value="agent">Agent</option>
                                            <option value="user">User</option>
                                            <option value="guest">Guest</option>
                                        </select>
                                        <button onClick={() => updateRole(user._id)} className="bg-blue-500 text-white p-1 rounded ml-2 hover:bg-blue-600 transition duration-300">Update</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <span>{user.role}</span>
                                        <button onClick={() => handleRoleChange(user._id)} className="bg-yellow-500 text-white p-1 rounded ml-2 hover:bg-yellow-600 transition duration-300">Edit Role</button>
                                    </div>
                                )}
                            </td>
                            <td className="border border-gray-300 p-2 flex space-x-2">
                                {user.status === 'active' ? (
                                    <button onClick={() => handleSuspend(user._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-300">Suspend</button>
                                ) : (
                                    <button onClick={() => handleActivate(user._id)} className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition duration-300">Activate</button>
                                )}
                                <button onClick={() => handleDelete(user._id)} className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 transition duration-300">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowUsers;
