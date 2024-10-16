import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
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
  const [itemsPerPage] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      console.log(response.data);
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
      );
    }
  
    if (filters.color) {
      filtered = filtered.filter((product) => {
        if (product.variants.length > 0) {
          return product.variants.some(variant => variant.color === filters.color);
        }
        return product.color === filters.color;
      });
    }
  
    if (filters.minPrice) {
      filtered = filtered.filter((product) => {
        if (product.variants.length > 0) {
          return product.variants.some(variant => variant.price >= Number(filters.minPrice));
        }
        return product.regularPrice >= Number(filters.minPrice);
      });
    }
  
    if (filters.maxPrice) {
      filtered = filtered.filter((product) => {
        if (product.variants.length > 0) {
          return product.variants.some(variant => variant.price <= Number(filters.maxPrice));
        }
        return product.regularPrice <= Number(filters.maxPrice);
      });
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
    navigate(`/editproduct/${product._id}`);
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
  const downloadBarcode = (sku) => {
    const barcodeElement = document.getElementById(`barcode-${sku}`);
    html2canvas(barcodeElement).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${sku}-barcode.png`;
      link.click();
    });
  };
  return (
    <div className="w-full px-8 overflow-y-auto">
      <div className="flex justify-between mt-10 items-center mb-4">
        <div className="text-2xl font-bold">Product List</div>
        <Link
          to="/newproduct"
          className="px-4 py-2 mt-2  bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                <th className="px-4 py-2 text-left">Weight(lbs)</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
  {currentProducts.map((product) => (
    product.variants.length > 0 ? (
      product.variants.map((variant, index) => (
        <tr key={variant.SKU + index} className="border-b">
          {index === 0 && (
            <td rowSpan={product.variants.length} className="border px-4 py-2">{product.parentName}</td>
          )}
          <td className="border px-4 py-2">{variant.name || product.name}</td>
          <td className="border px-4 py-2" id={`barcode-${product.SKU}`}>
                    <Barcode value={product.SKU} className="hidden" />{variant.SKU}</td>
          <td className="border px-4 py-2">{variant.price}$</td> {/* Display variant price */}
          <td className="border px-4 py-2">{variant.color}</td> {/* Display variant color */}
          <td className="border px-4 py-2">{variant.weight || product.weight}</td>
          <td className="border px-4 py-2 flex space-x-2">
            <button
              onClick={() => goToEditPage(product)}
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
            <button 
                      onClick={() => downloadBarcode(product.SKU)} 
                      className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                       Barcode
                    </button>
          </td>
        </tr>
      ))
    ) : (
      <tr key={product._id} className="border-b">
        <td className="border px-4 py-2">{product.parentName}</td>
        <td className="border px-4 py-2">{product.name}</td>
        <td className="border px-4 py-2">{product.SKU}</td>
        <td className="border px-4 py-2">{product.regularPrice}</td>
        <td className="border px-4 py-2">{product.color}</td>
        <td className="border px-4 py-2">{product.weight}</td>
        <td className="border px-4 py-2 flex space-x-2">
          <button
            onClick={() => goToEditPage(product)}
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
    )
  ))}
</tbody>

          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="flex items-center">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
