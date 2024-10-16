import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Customercategorylist = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customercategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
      console.log(response.data)
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="w-full mx-auto p-4 bg-background">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-text">Categories</h2>
      <table className="min-w-full bg-card border border-gray-300">
        <thead className='bg-navbar text-navbar-text'>
          <tr>
            <th className="py-2 px-4 border">Category ID</th>
            <th className="py-2 px-4 border">Category Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Actions</th> {/* New Actions Header */}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.customercategoryId}>
              <td className="py-2 px-4 border text-text">{category.customercategoryId}</td>
              <td className="py-2 px-4 border text-text">{category.customercategoryName}</td>
              <td className="py-2 px-4 border text-text">{category.customercategoryDescription}</td>
              <td className="py-2 px-4 border ">
                <button
                  onClick={() => navigate(`/edit-category/${category._id}`)} // Navigate to edit page
                  className="bg-blue-500 text-white py-1  px-3 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customercategorylist;
