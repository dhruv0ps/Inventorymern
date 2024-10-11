import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManagement = () => {
  const [customercategoryId, setCustomercategoryId] = useState('');
  const [customercategoryName, setCustomercategoryName] = useState('');
  const [customercategoryDescription, setCustomercategoryDescription] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customercategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch categories');
      setLoading(false);
    }
  };

  const loadCategoryForEdit = (category) => {
    setCustomercategoryId(category.customercategoryId);
    setCustomercategoryName(category.customercategoryName);
    setCustomercategoryDescription(category.customercategoryDescription);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customercategoryId || !customercategoryName || !customercategoryDescription) {
      setMessage('Please fill in all fields');
      return;
    }

    const categoryData = {
      customercategoryId,
      customercategoryName,
      customercategoryDescription,
    };

    try {
      const token = localStorage.getItem('token');

      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/customercategories/${customercategoryId}`, categoryData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Category updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/customercategories`, categoryData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Category created successfully');
      }

      clearForm();
      fetchCategories();
    } catch (error) {
      console.error(error);
      setMessage('Failed to save category');
    }
  };

  const clearForm = () => {
    setCustomercategoryId('');
    setCustomercategoryName('');
    setCustomercategoryDescription('');
    setIsEditing(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="w-full mx-auto p-4 bg-background">
      <h2 className="text-2xl font-bold mb-4 text-text">{isEditing ? 'Edit Category' : 'Create Category'}</h2>

      {message && <p className="mb-4 text-error">{message}</p>}

      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 bg-card p-4 rounded shadow-md">
          <div>
            <label htmlFor="customercategoryId" className="block text-sm font-medium text-text">
              Customer Category ID
            </label>
            <input
              type="text"
              id="customercategoryId"
              value={customercategoryId}
              onChange={(e) => setCustomercategoryId(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
              readOnly={isEditing}
            />
          </div>

          <div>
            <label htmlFor="customercategoryName" className="block text-sm font-medium text-text">
              Customer Category Name
            </label>
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
            <label htmlFor="customercategoryDescription" className="block text-sm font-medium text-text">
              Customer Category Description
            </label>
            <textarea
              id="customercategoryDescription"
              value={customercategoryDescription}
              onChange={(e) => setCustomercategoryDescription(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            {isEditing ? 'Update' : 'Submit'}
          </button>

          {isEditing && (
            <button type="button" onClick={clearForm} className="bg-gray-300 text-black py-2 px-4 rounded ml-2">
              Cancel
            </button>
          )}
        </form>

        <div className="flex-1 mt-4 md:mt-0">
          <h2 className="text-xl font-bold mb-4 text-text">Categories</h2>
          <table className="min-w-full bg-card border border-gray-300">
            <thead className='bg-navbar text-navbar-text'> 
              <tr>
                <th className="py-2 px-4 border">Category ID</th>
                <th className="py-2 px-4 border">Category Name</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.customercategoryId}>
                  <td className="py-2 px-4 border text-text">{category.customercategoryId}</td>
                  <td className="py-2 px-4 border text-text">{category.customercategoryName}</td>
                  <td className="py-2 px-4 border text-text">{category.customercategoryDescription}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => loadCategoryForEdit(category)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
