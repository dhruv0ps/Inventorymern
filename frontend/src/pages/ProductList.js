import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../componenets/Modal';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        size: '',
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        parentName: '',
        name: '',
        SKU: '',
        regularPrice: '',
        color: '',
        weight: '',
        variants: [{ size: '' }],
    });
    const [isModalOpen, setIsModalOpen] = useState(false); 

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
        filterProducts({ ...filters, [name]: value });
    };

    const filterProducts = (filters) => {
        let filtered = products;

    
        if (filters.search) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                product.SKU.toLowerCase().includes(filters.search.toLowerCase()) ||
                product.parentName?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        
        if (filters.color) {
            filtered = filtered.filter(product => product.color === filters.color);
        }

        
        if (filters.minPrice) {
            filtered = filtered.filter(product => product.regularPrice >= Number(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(product => product.regularPrice <= Number(filters.maxPrice));
        }

        
        if (filters.size) {
            filtered = filtered.filter(product => product.variants.some(variant => variant.size === filters.size));
        }

        setFilteredProducts(filtered);
    };

    
    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productId}`);
                alert('Product deleted successfully!');
                fetchProducts(); 
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            parentName: product.parentName,
            name: product.name,
            SKU: product.SKU,
            regularPrice: product.regularPrice,
            color: product.color,
            weight: product.weight,
            variants: product.variants || [{ size: '' }],
        });
        setIsModalOpen(true); 
    };

    
    const handleFormChange = (e) => {
        const { name, value } = e.target;


        setFormData({ ...formData, [name]: value });
    };

    
    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/${editingProduct._id}`, formData);
            alert('Product updated successfully!');
            fetchProducts();
            setIsModalOpen(false); 
            setEditingProduct(null);
            setFormData({ parentName: '', name: '', SKU: '', regularPrice: '', color: '', weight: '', variants: [{ size: '' }] }); // Reset form data
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <div className="container">
                <div className="text-2xl font-bold">Product List</div>

              
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by name, SKU or Parent Name"
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
                    <select
                        name="size"
                        value={filters.size}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="">Select Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>
                </div>

               
                <table className="min-w-full border-collapse bg-white">
                    <thead>
                        <tr style={{ backgroundColor: '#E3F2FD' }}>
                            <th className="px-4 py-2 text-left text-gray-600">Parent Name</th>
                            <th className="px-4 py-2 text-left text-gray-600">Child Name</th>
                            <th className="px-4 py-2 text-left text-gray-600">SKU</th>
                            <th className="px-4 py-2 text-left text-gray-600">Regular Price</th>
                            <th className="px-4 py-2 text-left text-gray-600">Color</th>
                            <th className="px-4 py-2 text-left text-gray-600">Size</th>
                            <th className="px-4 py-2 text-left text-gray-600">Weight</th>
                            <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product._id} className="bg-teal-50 border-b">
                                <td className="border px-4 py-2">{product.parentName}</td>
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2">{product.SKU}</td>
                                <td className="border px-4 py-2">{product.regularPrice}</td>
                                <td className="border px-4 py-2">{product.color}</td>
                                <td className="border px-4 py-2">{product.variants[0]?.size}</td>
                                <td className="border px-4 py-2">{product.weight}</td>
                                <td className="border px-4 py-2 flex space-x-2">
                                   
                                    <button 
                                        onClick={() => handleEditClick(product)} 
                                        className="px-4 py-2 border border-gray-500 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleDelete(product._id)} 
                                        className="px-4 py-2 border border-gray-500 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

              
                {isModalOpen && (
                    <Modal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onSubmit={handleSubmitEdit}
                        formData={formData}
                        handleFormChange={handleFormChange}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductList;
