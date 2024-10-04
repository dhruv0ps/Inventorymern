import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(6);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories', {
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
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
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
        `http://localhost:5000/api/categories/${editingCategory._id}`,
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

  return (
    <div className="container mx-auto mt-8 p-4 max-w-full">
      <h2 className="text-3xl flex justify-center font-semibold mb-6 text-gray-800">All Categories</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

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

      <div className="grid grid-cols-3 gap-4">
        {currentCategories.map((category) => (
          <div key={category._id} className="border p-4 rounded-lg bg-white shadow-md">
            <strong className="text-teal-700">{category.name}</strong>
            <p>{category.description}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(category)}
                className="bg-teal-500 text-white px-2 py-1 rounded hover:bg-teal-600 transition-colors duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <ul className="flex list-none">
          {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }).map((_, index) => (
            <li key={index} className={`mx-1 cursor-pointer ${currentPage === index + 1 ? 'text-teal-700 font-semibold' : ''}`}>
              <button
                onClick={() => paginate(index + 1)}
                className="px-3 py-1 border rounded hover:bg-teal-200"
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryList;
