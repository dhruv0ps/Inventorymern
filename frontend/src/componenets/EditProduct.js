import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
    const { id } = useParams();  // Fetching productId from URL parameters
    const [parentName, setParentName] = useState('');
    const [variants, setVariants] = useState([]);
    const [SKU, setSku] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const colors = [
        'Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 
        'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Cyan', 
        'Magenta', 'Lime', 'Teal', 'Navy', 'Maroon', 'Olive', 
        'Coral', 'Gold'
    ];
console.log(id)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
                const productData = response.data;
                setParentName(productData.parentName);
                setVariants(productData.variants);
                setName(productData.name);
                setDescription(productData.description);
                setSku(productData.SKU);
            } catch (error) {
                toast.error("Error fetching product: " + error.message);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tags`);
                setAvailableTags(response.data);
            } catch (error) {
                console.error("There was an error fetching tags!", error);
            }
        };

        fetchProduct();
        fetchTags();
    }, [id]);

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const handleAddRawMaterial = (index) => {
        const updatedVariants = [...variants];
        updatedVariants[index].rawMaterials.push({ material: '', quantity: '', unit: '' });
        setVariants(updatedVariants);
    };

    const handleRawMaterialChange = (index, materialIndex, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index].rawMaterials[materialIndex][field] = value;
        setVariants(updatedVariants);
    };

    const handleTagChange = (index, event) => {
        const selectedTagId = event.target.value;
        const selectedTag = availableTags.find(tag => tag._id === selectedTagId);
        if (selectedTag && !variants[index].tags.includes(selectedTag)) {
            const updatedVariants = [...variants];
            updatedVariants[index].tags.push(selectedTag);
            setVariants(updatedVariants);
        }
    };

    const handleRemoveTag = (variantIndex, tagToRemove) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].tags = updatedVariants[variantIndex].tags.filter(tag => tag._id !== tagToRemove._id);
        setVariants(updatedVariants);
    };

    const validateInputs = () => {
        for (const variant of variants) {
            if (!variant.size || !variant.firmness || !variant.price || !variant.weight || !variant.color ||
                variant.rawMaterials.some(m => !m.material || !m.quantity || !m.unit) || variant.tags.length === 0) {
                toast.error("Please fill in all required fields for each variant.");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateInputs()) return;

        setLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
                parentName,
                variants,
                name,
                description,
            });
            toast.success("Product updated successfully!");
            // Optionally redirect or do something after update
        } catch (error) {
            toast.error("Error updating product: " + error.message);
        } finally {
            setLoading(false);
        }
    };

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
                            value={SKU}
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
                            <input
                                type="number"
                                placeholder="Price"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="number"
                                placeholder="Weight (lbs)"
                                value={variant.weight}
                                onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <select 
                                value={variant.color} 
                                onChange={(e) => handleVariantChange(index, 'color', e.target.value)} 
                                required
                                className="mt-1 p-1 border border-gray-300 rounded w-full h-20"
                            >
                                <option value="">Choose a color...</option>
                                {colors.map((color, idx) => (
                                    <option key={idx} value={color}>{color}</option>
                                ))}
                            </select>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Raw Materials:</label>
                                {variant.rawMaterials.map((material, materialIndex) => (
                                    <div key={materialIndex} className="grid grid-cols-3 gap-4 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Material"
                                            value={material.material}
                                            onChange={(e) => handleRawMaterialChange(index, materialIndex, 'material', e.target.value)}
                                            required
                                            className="p-2 border border-gray-300 rounded w-full"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            value={material.quantity}
                                            onChange={(e) => handleRawMaterialChange(index, materialIndex, 'quantity', e.target.value)}
                                            required
                                            className="p-2 border border-gray-300 rounded w-full"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Unit"
                                            value={material.unit}
                                            onChange={(e) => handleRawMaterialChange(index, materialIndex, 'unit', e.target.value)}
                                            required
                                            className="p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddRawMaterial(index)}
                                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                                >
                                    Add Raw Material
                                </button>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold">Tags:</label>
                                <select 
                                    onChange={(e) => handleTagChange(index, e)} 
                                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                                >
                                    <option value="">Select a tag</option>
                                    {availableTags.map(tag => (
                                        <option key={tag._id} value={tag._id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-2">
                                    {variant.tags.map(tag => (
                                        <span 
                                            key={tag._id} 
                                            className="inline-block bg-gray-200 text-gray-700 rounded px-2 py-1 text-sm mr-2 mb-2"
                                        >
                                            {tag.name}
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveTag(index, tag)} 
                                                className="ml-2 text-red-500"
                                            >
                                                x
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    type="submit" 
                    className="p-3 bg-green-500 text-white rounded disabled:opacity-50" 
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;

