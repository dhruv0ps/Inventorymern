import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem("token");

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/categories',
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Category added successfully');
      setName('');
      setDescription('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add category');
    }
  };

  return (
    <div className="container w-9/12 mx-auto mt-8 p-4 max-w-xl">
      <h2 className="text-3xl flex justify-center font-semibold mb-6 text-gray-800">Add New Category</h2>

      <form onSubmit={handleAddCategory} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-500 p-3 w-full rounded focus:outline-none focus:border-teal-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Category Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-500 p-3 w-full rounded focus:outline-none focus:border-teal-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-teal-500 text-white w-full py-3 rounded hover:bg-teal-600 transition-colors duration-300"
        >
          Add Category
        </button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
    </div>
  );
};

export default AddCategory;
