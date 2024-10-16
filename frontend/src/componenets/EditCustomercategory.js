import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCustomercategory = () => {
  const [customercategoryName, setCustomercategoryName] = useState('');
  const [customercategoryDescription, setCustomercategoryDescription] = useState('');
  const [customercategoryId, setCustomercategoryId] = useState(''); // Updated to keep naming consistent

  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation

  // Fetch the category when the component mounts
  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customercategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Added auth header
      });
      setCustomercategoryId(response.data.customercategoryId);
      setCustomercategoryName(response.data.customercategoryName); // Set category name
      setCustomercategoryDescription(response.data.customercategoryDescription); // Set description
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch category');
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  // Handle the form submission for updating the category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/customercategories/${id}`, {
        customercategoryName,
        customercategoryDescription,
      }, {
        headers: { Authorization: `Bearer ${token}` }, // Added auth header
      });
      toast.success('Category updated successfully');
      navigate('/categories'); // Redirect to the category list
    } catch (error) {
      console.error(error);
      toast.error('Failed to update category');
    }
  };

  return (
    <div className="container w-6/12 mt-10 mx-auto p-4 bg-white shadow-lg box-border h-96 overflow-y-auto">

      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-text">Edit Category</h2>
      <p className="text-lg mb-4 text-text">Category ID: <strong>{customercategoryId}</strong></p> {/* Displaying Category ID */}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text">Category Name</label>
          <input
            type="text"
            value={customercategoryName}
            onChange={(e) => setCustomercategoryName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text">Description</label>
          <textarea
            value={customercategoryDescription}
            onChange={(e) => setCustomercategoryDescription(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCustomercategory;
