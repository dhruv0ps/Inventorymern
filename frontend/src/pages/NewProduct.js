import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewProduct = () => {
    const [parentName, setParentName] = useState('');
    const [variants, setVariants] = useState([{ size: '', firmness: '' }]);
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [regularPrice, setRegularPrice] = useState('');
    const [weight, setWeight] = useState(''); // New state for weight
    const [rawMaterials, setRawMaterials] = useState([{ material: '', quantity: '', unit: '' }]);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skuVisible, setSkuVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState(''); 

    const colors = [
        'Red',
        'Green',
        'Blue',
        'Yellow',
        'Black',
        'White',
        'Orange',
        'Purple',
        'Pink',
        'Brown',
        'Gray',
        'Cyan',
        'Magenta',
        'Lime',
        'Teal',
        'Navy',
        'Maroon',
        'Olive',
        'Coral',
        'Gold'
    ];
    

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
        if (selectedTag && !selectedTags.includes(selectedTag)) {
            setSelectedTags([...selectedTags, selectedTag]);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag._id !== tagToRemove._id));
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

        setLoading(true); 
        const tagNames = selectedTags.map(tag => tag.name); 
        console.log(tagNames);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, {
                parentName,
                variants,
                name,
                description,
                regularPrice,
                weight, // Include weight in the submission
                rawMaterials,
                tags: tagNames,
                color: selectedColor, 
            });

            setSku(response.data.sku);
            setSkuVisible(true);
            toast.success("Product added successfully!"); 
            resetForm();
        } catch (error) {
            toast.error("Error adding product: " + error.message); 
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
  
    const resetForm = () => {
        setParentName('');
        setVariants([{ size: '', firmness: '' }]);
        setName('');
        setDescription('');
        setRegularPrice('');
        setWeight(''); // Reset weight
        setRawMaterials([{ material: '', quantity: '', unit: '' }]);
        setSelectedTags([]); 
        setSkuVisible(false); 
        setSelectedColor(''); 
    };

    return (
        <div className="container mx-auto mt-5 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 ml-2 mr-2 sm:ml-5 sm:mr-5 md:ml-10 md:mr-10 lg:ml-16 lg:mr-16 h-200 overflow-y-scroll bg-navbar border border-gray-300 rounded-lg shadow-md">

            <ToastContainer />
            <h2 className="text-2xl font-bold text-center mb-6">Add New Product</h2>
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
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Add Variant
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                        >
                            Add Raw Material
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Select Tags:</label>
                    <select onChange={handleTagChange} className="mt-1 p-2 border border-gray-300 rounded w-full">
                        <option value="">Choose a tag...</option>
                        {availableTags.map((tag) => (
                            <option key={tag._id} value={tag._id}>{tag.name}</option>
                        ))}
                    </select>
                    <div className="mt-2">
                        {selectedTags.map((tag) => (
                            <span key={tag._id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                {tag.name}
                                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-red-600">&times;</button>
                            </span>
                        ))}
                    </div>
                </div>
               <div className='flex justify-end mr-10'>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-40  flex  bg-green-500 text-white py-2 px-8 mb-2  rounded hover:bg-green-600 transition"
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
                </div>
            </form>
        </div>
    );
};

export default NewProduct;

