import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateCategory = () => {
  const [customercategoryId, setCustomercategoryId] = useState('');
  const [customercategoryName, setCustomercategoryName] = useState('');
  const [customercategoryDescription, setCustomercategoryDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { customercategoryId, customercategoryName, customercategoryDescription };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/customercategories`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Category created successfully!');
      navigate('/categories');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  return (
    <div className="w-5/12 mt-10  mx-auto p-4 ">
      <h2 className="text-2xl font-bold mb-4 text-text">Create Category</h2>
      <form onSubmit={handleSubmit} className="bg-card p-4 rounded shadow-md space-y-4">
        <div>
          <label htmlFor="customercategoryId" className="block text-sm font-medium text-text">Customer Category ID</label>
          <input
            type="text"
            id="customercategoryId"
            value={customercategoryId}
            onChange={(e) => setCustomercategoryId(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="customercategoryName" className="block text-sm font-medium text-text">Customer Category Name</label>
          <input
            type="text"
            id="customercategoryName"
            value={customercategoryName}
            onChange={(e) => setCustomercategoryName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="customercategoryDescription" className="block text-sm font-medium text-text">Customer Category Description</label>
          <textarea
            id="customercategoryDescription"
            value={customercategoryDescription}
            onChange={(e) => setCustomercategoryDescription(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
      </form>
    </div>
  );
};

export default CreateCategory;
