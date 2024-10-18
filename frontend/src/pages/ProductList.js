import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      toast.error('Error fetching products');
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
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter((product) =>
            product.SKU.toLowerCase().includes(searchTerm) ||
            product.parentName?.toLowerCase().includes(searchTerm) ||
            product.variants.some((variant) =>
                variant.childName?.toLowerCase().includes(searchTerm)
            )
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

  const toggleVariantStatus = async (productId, variantId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${productId}/variants/${variantId}/toggleActive`);
      alert('Variant status updated successfully');
      fetchProducts(); // Refresh the product list
      toast.success("Variant status updated successfully")
    } catch (error) {
      console.error('Error updating variant status:', error);
    }
  };
  

  const goToEditPage = (product) => {
    navigate(`/editproduct/${product._id}`);
  };

 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


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
    
   
    barcodeElement.style.display = 'block';
  
    html2canvas(barcodeElement).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${sku}-barcode.png`;
      link.click();
  
      
      barcodeElement.style.display = 'none';
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

     
      <div className="overflow-x-auto ">
        {loading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
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
        <tr key={variant.SKU + index} className="border-b  hover:bg-gray-100">
          {index === 0 && (
            <td rowSpan={product.variants.length} className="border px-4 py-2">{product.parentName}</td>
          )}
          <td className="border px-4 py-2">{variant.childName || product.name}</td>
          <td className="border px-4 py-2">
  
  <div id={`barcode-${product.SKU}`} style={{ display: 'none' }}>
    <Barcode value={product.SKU} />
  </div>
  {variant.SKU}
</td>
          <td className="border px-4 py-2">{variant.price}$</td>
          <td className="border px-4 py-2">{variant.color}</td>
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
                      className="ml-2 px-2 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                       Barcode
                    </button>
                    <button 
             onClick={() => toggleVariantStatus(product._id, variant._id)} 
              className={`ml-2 px-2 py-2 ${variant.isActive ? 'bg-yellow-500' : 'bg-green-500'} text-white rounded hover:${variant.isActive ? 'bg-yellow-600' : 'bg-green-600'} transition`}
            >
              {variant.isActive ? 'Deactivate' : 'Activate'}
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

    
      <div className="flex justify-center mt-4">
                <button
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-300'}`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white transition duration-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-300'}`}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
      <ToastContainer/>
    </div>
  );
};

export default ProductList;