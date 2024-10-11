// src/components/ProductList.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    color: '',
    minPrice: '',
    maxPrice: '',
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterProducts(newFilters);
  };

  const filterProducts = (filters) => {
    let filtered = products;

    if (filters.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.SKU.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.parentName?.toLowerCase().includes(filters.search.toLowerCase()) 
        // product.weight.toString().includes(filters.search) // Include weight in search
      );
    }

    if (filters.color) {
      filtered = filtered.filter((product) => product.color === filters.color);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((product) => product.regularPrice >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((product) => product.regularPrice <= Number(filters.maxPrice));
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productId}`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const goToEditPage = (product) => {
    navigate(`/editproduct/${product._id}`); // Use navigate instead of history
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full px-4">
      <div className="flex justify-between mt-10 items-center mb-4">
        <div className="text-2xl font-bold">Product List</div>
        <Link
          to="/newproduct"
          className="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> {/* Adjust grid columns to 4 */}
        <input
          type="text"
          name="search"
          placeholder="Search by name, SKU, Parent Name or Weight"
          value={filters.search}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <select
          name="color"
          value={filters.color}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">Select Color</option>
          <option value="Red">Red</option>
    <option value="Green">Green</option>
    <option value="Blue">Blue</option>
    <option value="Yellow">Yellow</option>
    <option value="Orange">Orange</option>
    <option value="Purple">Purple</option>
    <option value="Pink">Pink</option>
    <option value="Brown">Brown</option>
    <option value="Gray">Gray</option>
    <option value="Cyan">Cyan</option>
    <option value="Magenta">Magenta</option>
    <option value="Lime">Lime</option>
    <option value="Teal">Teal</option>
    <option value="Navy">Navy</option>
    <option value="Maroon">Maroon</option>
    <option value="Olive">Olive</option>
    <option value="Coral">Coral</option>
    <option value="Gold">Gold</option>
          
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Parent Name</th>
                <th className="px-4 py-2 text-left">Child Name</th>
                <th className="px-4 py-2 text-left">SKU</th>
                <th className="px-4 py-2 text-left">Regular Price</th>
                <th className="px-4 py-2 text-left">Color</th>
                <th className="px-4 py-2 text-left">Weight</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="border px-4 py-2">{product.parentName}</td>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.SKU}</td>
                  <td className="border px-4 py-2">{product.regularPrice}</td>
                  <td className="border px-4 py-2">{product.color}</td>
                  <td className="border px-4 py-2">{product.weight}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => goToEditPage(product)} // Navigate to edit page
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 ">
        <button
          onClick={handlePreviousPage}
          className={`px-3 py-1 mr-4 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition'}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePagination(index + 1)}
            className={`px-3 py-1  rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          className={`px-3 py-1 ml-4 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition'}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
