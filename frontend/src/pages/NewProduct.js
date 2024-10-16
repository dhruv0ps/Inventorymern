import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewProduct = () => {
    const [parentName, setParentName] = useState('');
    const [variants, setVariants] = useState([{ size: '', firmness: '', price: '', weight: '', color: '', childName: '', rawMaterials: [{ material: '', quantity: '', unit: '' }], tags: [] }]);
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skuVisible, setSkuVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const colors = [
        'Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 
        'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Cyan', 
        'Magenta', 'Lime', 'Teal', 'Navy', 'Maroon', 'Olive', 
        'Coral', 'Gold'
    ];
    const token = localStorage.getItem('token');

    const handleAddVariant = () => {
        setVariants([...variants, { size: '', firmness: '', price: '', weight: '', color: '', rawMaterials: [{ material: '', quantity: '', unit: '' }], tags: [] }]);
        
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = variants.filter((_, idx) => idx !== index);
        setVariants(updatedVariants);
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };


    const handleAddRawMaterial = (index) => {
        const newVariants = [...variants];
        newVariants[index].rawMaterials.push({ material: '', quantity: '', unit: '' });
        setVariants(newVariants);
    };
    
    
    const handleRemoveRawMaterial = (variantIndex, materialIndex) => {
        setVariants(prevVariants => {
            const updatedVariants = [...prevVariants];
            updatedVariants[variantIndex].rawMaterials.splice(materialIndex, 1);
            return updatedVariants;
        });
    };
    
    const handleRawMaterialChange = (index, materialIndex, field, value) => {
        setVariants(prevVariants => {
            const updatedVariants = [...prevVariants];
    
            if (field === 'material') {
                const selectedMaterial = rawMaterials.find(raw => raw.material === value);
                if (selectedMaterial) {
                    updatedVariants[index].rawMaterials[materialIndex] = {
                        material: selectedMaterial.material,
                        quantity: updatedVariants[index].rawMaterials[materialIndex].quantity,
                        unit: selectedMaterial.measuringUnit,
                    };
                }
            } else {
                updatedVariants[index].rawMaterials[materialIndex][field] = value;
            }
    
            return updatedVariants;
        });
    };

   const handleTagChange = (index, e) => {
    const selectedTagId = e.target.value;
    const newVariants = [...variants];
    const selectedVariant = newVariants[index];

    if (selectedTagId) {
        const tagToAdd = availableTags.find(tag => tag._id === selectedTagId);
        if (tagToAdd && !selectedVariant.tags.includes(tagToAdd.name)) {
            selectedVariant.tags.push(tagToAdd.name); // Store only the tag name
        }
    }

    setVariants(newVariants);
};

const handleRemoveTag = (index, tagToRemove) => {
    setVariants(prevVariants => {
        const newVariants = [...prevVariants];
        const selectedVariant = newVariants[index];

        if (selectedVariant && selectedVariant.tags) {
         
            selectedVariant.tags = selectedVariant.tags.filter(tag => tag !== tagToRemove);
        }

        return newVariants;
    });
};

    const validateInputs = () => {
        for (const variant of variants) {
            if (!variant.size || !variant.firmness || !variant.price || !variant.weight || !variant.color ||
                variant.rawMaterials.some(m => !m.material || !m.quantity || !m.unit) ) {
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
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, {
                parentName,
                variants,
                name,
                description,
                category: selectedCategory,
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategories(response.data);
            } catch (error) {
                console.error("There was an error fetching categories!", error);
                toast.error("Error fetching categories: " + error.message);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchRawMaterials = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/raw-materials`);
                setRawMaterials(response.data);
            } catch (error) {
                console.error('Error fetching raw materials:', error);
            }
        };

        fetchRawMaterials();
    }, []);

    const resetForm = () => {
        setParentName('');
        setVariants([{ size: '', firmness: '', price: '', weight: '', color: '', childName: '', rawMaterials: [{ material: '', quantity: '', unit: '' }], tags: [] }]);
        setName('');
        setDescription('');
        setSkuVisible(false);
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
                    <div className="md:col-span-1  ">
                        <label htmlFor="category-select" className="block  text-gray-700 font-semibold">
                            Select a Category
                        </label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category.name}>{category.name}</option>
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
                                placeholder="Child Name"  // New field for child name
                                value={variant.childName}
                                onChange={(e) => handleVariantChange(index, 'childName', e.target.value)}
                                required
                                aria-label={`Variant ${index + 1} Child Name`}
                                className="p-2 border border-gray-300 rounded w-full"
                            />
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
                                className="mt-1 p-1 border border-gray-300 rounded w-full h-11" // Adjusted for smaller size
                            >
                                <option value="">Choose a color...</option>
                                {colors.map((color, idx) => (
                                    <option key={idx} value={color}>{color}</option>
                                ))}
                            </select>
                            
                            <div>
                        <label className="block text-gray-700 font-semibold">Child SKU:</label>
                        <input
                            type="text"
                            value={sku}
                            readOnly
                            placeholder="Auto-generated SKU"
                            className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
    <label className="block text-gray-700 font-semibold mb-2">Raw Materials:</label>
    {variant.rawMaterials.map((material, materialIndex) => (
                        <div key={materialIndex} className="flex mb-2">
                            <select
                                onChange={(event) => handleRawMaterialChange(index, materialIndex, 'material', event.target.value)}
                                className="block w-full border border-gray-300 rounded mr-2  "
                                required
                            >
                                <option value="">Select a raw material</option>
                                {rawMaterials.map((raw) => (
                                    <option key={raw._id} value={raw.material}>{raw.material}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                onChange={(e) => handleRawMaterialChange(index, materialIndex, 'quantity', e.target.value)}
                                placeholder="Quantity"
                                required
                                className="p-2 border border-gray-300 rounded w-full mr-2"
                            />
                            <input
                                type="text"
                                value={material.unit || ''} 
                                readOnly 
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            {variant.rawMaterials.length > 1 && ( 
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRawMaterial(index, materialIndex)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                >
                                    Remove
                                </button>
                            )}
                            
                        </div>
                        
                    ))}
                    
    <button
        type="button"
        onClick={() => handleAddRawMaterial(index)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
        Add Raw Material
    </button>
    
</div>


           <select 
    onChange={(e) => handleTagChange(index, e)} 
    className="mt-1 p-1 border border-gray-300 rounded w-full h-10"
>
    <option value="">Select Tag</option>
    {availableTags.map(tag => (
        <option key={tag._id} value={tag._id}>{tag.name}</option>
    ))}
</select>

<div className="flex flex-wrap">
    {variant.tags.map((tag, tagIndex) => (
        <span key={tagIndex} className="bg-gray-200 rounded-full px-2 py-1 text-sm mr-2">
            {tag}
            <button
                type="button"
                onClick={() => handleRemoveTag(index, tag)} 
                className="ml-1 text-red-500"
            >
                x
            </button>
        </span>
    ))}

    {variants.length > 1 && (
        <button
            type="button"
            onClick={() => handleRemoveVariant(index)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
        >
            Remove
        </button>
    )}
</div>

                        </div>
                        
                    ))}
                    
                    <button
                        type="button"
                        onClick={handleAddVariant}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Variant
                    </button>
                    
                </div>
             <div className='flex justify-end mr-4'>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {loading ? 'Loading...' : 'Submit Product'}
                </button>
                </div>
            </form>
        </div>
    );
};

export default NewProduct;
