import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the toastify styles

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const token = localStorage.getItem("token");

  const handleAddCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/categories`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      toast.success('Category added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Clear the form
      setName('');
      setDescription('');
    } catch (error) {
      // Show error toast
      toast.error(error.response?.data?.message || 'Failed to add category', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="container w-9/12 mx-auto mt-24 p-4 max-w-xl">
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
            maxLength={256}
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

      
      <ToastContainer />
    </div>
  );
};

export default AddCategory;
