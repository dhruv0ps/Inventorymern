import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [updatedRole, setUpdatedRole] = useState('');
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
             
                const [usersResponse, rolesResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/roles`),
                ]);
                setUsers(usersResponse.data);
                setRoles(rolesResponse.data);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateUserStatus = async (userId, action) => {
        setActionLoading(userId);
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/users/${userId}/${action}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setUsers(users.map(user =>
                user._id === userId ? { ...user, status: action === 'activate' ? 'active' : 'suspended' } : user
            ));
        } catch (err) {
            setError(`Error ${action === 'activate' ? 'activating' : 'suspending'} user.`);
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setActionLoading(userId);
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            setError('Error deleting user.');
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRoleChange = (userId, currentRole) => {
        setSelectedUserId(userId);
        setUpdatedRole(currentRole);
    };

    const updateRole = async (userId) => {
        setActionLoading(userId);
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/users/${userId}/role`,
                { role: updatedRole },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: updatedRole } : user
            ));
            setSelectedUserId(null);
            setUpdatedRole('');
        } catch (err) {
            setError('Error updating role.');
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const addNewRole = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert(response.data.message);
            setNewRole('');
            setRoles([...roles, { name: newRole }]); 
        } catch (err) {
            setError('Error adding new role.');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 mt-2 text-center">User List</h2>
            
            <form onSubmit={addNewRole} className="mb-4 flex items-center justify-center">
                <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="New Role"
                    className="border border-gray-300 p-2 rounded mr-2"
                    required
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300">
                    Add Role
                </button>
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
                                            value={updatedRole}
                                            onChange={(e) => setUpdatedRole(e.target.value)}
                                            className="border border-gray-300 p-1 rounded"
                                        >
                                            {roles.map((roleOption) => (
                                                <option key={roleOption.id} value={roleOption.name}>
                                                    {roleOption.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button onClick={() => updateRole(user._id)} className="bg-blue-500 text-white p-1 rounded ml-2 hover:bg-blue-600 transition duration-300">
                                            {actionLoading === user._id ? 'Updating...' : 'Update'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <span>{user.role}</span>
                                        <button onClick={() => handleRoleChange(user._id, user.role)} className="bg-yellow-500 text-white p-1 rounded ml-2 hover:bg-yellow-600 transition duration-300">
                                            Edit Role
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button onClick={() => updateUserStatus(user._id, user.status === 'active' ? 'suspend' : 'activate')} className={`bg-${user.status === 'active' ? 'red' : 'green'}-500 text-white p-1 rounded hover:bg-${user.status === 'active' ? 'red' : 'green'}-600 transition duration-300`}>
                                    {actionLoading === user._id ? 'Loading...' : user.status === 'active' ? 'Suspend' : 'Activate'}
                                </button>
                                <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-300 ml-2">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowUsers;
