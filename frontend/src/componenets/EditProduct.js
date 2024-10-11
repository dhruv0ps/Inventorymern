import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const [parentName, setParentName] = useState('');
    const [variants, setVariants] = useState([{ size: '', firmness: '' }]);
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [regularPrice, setRegularPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [rawMaterials, setRawMaterials] = useState([{ material: '', quantity: '', unit: '' }]);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skuVisible, setSkuVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Black', 'White'];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
                const product = response.data;
                setParentName(product.parentName);
                setVariants(product.variants);
                setSku(product.sku);
                setName(product.name);
                setDescription(product.description);
                setRegularPrice(product.regularPrice);
                setWeight(product.weight);
                setRawMaterials(product.rawMaterials);
                setSelectedTags(product.tags); // Tags should be strings
                setSelectedColor(product.color);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to fetch product details.');
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddVariant = () => {
        setVariants([...variants, { size: '', firmness: '' }]);
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const handleAddRawMaterial = () => {
        setRawMaterials([...rawMaterials, { material: '', quantity: '', unit: '' }]);
    };

    const handleRawMaterialChange = (index, field, value) => {
        const updatedMaterials = [...rawMaterials];
        updatedMaterials[index][field] = value;
        setRawMaterials(updatedMaterials);
    };

    const handleTagChange = (event) => {
        const selectedTagId = event.target.value;
        const selectedTag = availableTags.find(tag => tag._id === selectedTagId);
        if (selectedTag && !selectedTags.includes(selectedTag.name)) {
            setSelectedTags([...selectedTags, selectedTag.name]); // Add only the tag name
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove)); // Remove the tag by name
    };

    const validateInputs = () => {
        if (!parentName || !name || !description || !regularPrice || !weight || !selectedColor || 
            variants.some(v => !v.size || !v.firmness) || 
            rawMaterials.some(m => !m.material || !m.quantity || !m.unit)) {
            toast.error("Please fill in all required fields.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateInputs()) return;
        const tagNames = selectedTags; // Directly use selected tags (strings)
        setLoading(true); 
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
                parentName,
                variants,
                name,
                description,
                regularPrice,
                weight,
                rawMaterials,
                tags: tagNames, // Send tag names
                color: selectedColor,
            });

            setSku(response.data.sku);
            setSkuVisible(true);
            toast.success("Product updated successfully!"); 
        } catch (error) {
            toast.error("Error updating product: " + error.message); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/tags`)
            .then((response) => {
                setAvailableTags(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching tags!", error);
            });
    }, []);
  
    return (
        <div className="container mx-auto mt-5 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 ml-2 mr-2 sm:ml-5 sm:mr-5 md:ml-10 md:mr-10 lg:ml-16 lg:mr-16 h-200 overflow-y-scroll bg-navbar border border-gray-300 rounded-lg shadow-md">
            <ToastContainer />
            <h2 className="text-2xl font-bold text-center mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Parent Name:</label>
                        <input
                            type="text"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">SKU:</label>
                        <input
                            type="text"
                            value={sku}
                            readOnly
                            placeholder="Auto-generated SKU"
                            className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Product Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Product Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Regular Price:</label>
                        <input
                            type="number"
                            value={regularPrice}
                            onChange={(e) => setRegularPrice(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">Weight (lbs):</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold">Select Color:</label>
                        <select 
                            value={selectedColor} 
                            onChange={(e) => setSelectedColor(e.target.value)} 
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        >
                            <option value="">Choose a color...</option>
                            {colors.map((color, index) => (
                                <option key={index} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Variants:</label>
                    {variants.map((variant, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <input
                                type="text"
                                placeholder="Size"
                                value={variant.size}
                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="text"
                                placeholder="Firmness"
                                value={variant.firmness}
                                onChange={(e) => handleVariantChange(index, 'firmness', e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddVariant}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Add Variant
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Raw Materials:</label>
                    {rawMaterials.map((material, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                            <input
                                type="text"
                                placeholder="Material"
                                value={material.material}
                                onChange={(e) => handleRawMaterialChange(index, 'material', e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={material.quantity}
                                onChange={(e) => handleRawMaterialChange(index, 'quantity', e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="text"
                                placeholder="Unit"
                                value={material.unit}
                                onChange={(e) => handleRawMaterialChange(index, 'unit', e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddRawMaterial}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Add Raw Material
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Tags:</label>
                    <select onChange={handleTagChange} className="p-2 border border-gray-300 rounded w-full">
                        <option value="">Select a tag...</option>
                        {availableTags.map((tag) => (
                            <option key={tag._id} value={tag._id}>{tag.name}</option>
                        ))}
                    </select>
                    <div className="mt-2">
                        {selectedTags.map((tag, index) => (
                            <span key={index} className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2">
                                {tag} {/* Render the tag string directly */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 text-red-500"
                                >
                                    x
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
<div className='flex justify-end mb-2'>
                <button
                    type="submit"
                    className={`bg-green-500 text-white p-2 rounded hover:bg-green-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Product'}
                </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
