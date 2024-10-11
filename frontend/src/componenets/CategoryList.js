import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5); // Changed to 10 rows per page
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, [token]);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter(category => category._id !== id));
    } catch (error) {
      setError('Failed to delete category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/categories/${editingCategory._id}`,
        editingCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedCategories = categories.map(cat =>
        cat._id === response.data._id ? response.data : cat
      );
      setCategories(updatedCategories);
      setIsEditing(false);
      setEditingCategory(null);
    } catch (error) {
      setError('Failed to update category');
    }
  };

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  return (
    <div className="container mx-auto mt-8 p-4 max-w-full">
      <h2 className="text-3xl flex justify-center font-semibold mb-6 text-gray-800">All Categories</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end mr-10 mb-4">
        <Link to="/addnewcategory">
          <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300">
            Add Category
          </button>
        </Link>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl mb-4">Edit Category</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Category Name"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="border border-gray-500 p-3 w-full rounded focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Category Description"
              value={editingCategory.description}
              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
              className="border border-gray-500 p-3 w-full rounded focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-teal-500 text-white w-full py-3 rounded hover:bg-teal-600 transition-colors duration-300"
          >
            Update Category
          </button>
        </form>
      ) : null}

      <div className="overflow-x-auto bg-background p-4 rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-background">
            <tr>
              <th className="py-2 px-4 border border-gray-200 text-left text-text">Category Name</th>
              <th className="py-2 px-4 border border-gray-200 text-left text-text">Description</th>
              <th className="py-2 px-4 border border-gray-200 text-left text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border border-gray-200">{category.name}</td>
                <td className="py-2 px-4 border border-gray-200">{category.description}</td>
                <td className="py-2 px-4 border border-gray-200">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-500 text-white px-2 py-1 mr-2 rounded hover:bg-teal-600 transition-colors duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <ul className="flex list-none">
          <li className={`mx-1 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }).map((_, index) => (
            <li key={index} className={`mx-1 cursor-pointer ${currentPage === index + 1 ? 'text-white bg-blue-500' : ''}`}>
              <button
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'} transition-colors duration-300`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`mx-1 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryList;
