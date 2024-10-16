import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

const EditProduct = () => {
    const { id } = useParams();
    const [parentName, setParentName] = useState('');
    const [variants, setVariants] = useState([{
        size: '',
        firmness: '',
        price: '',
        weight: '',
        color: '',
        childName: '',
        rawMaterials: [{ material: '', quantity: '', unit: '' }],
        tags: []
    }]);
    const navigate = useNavigate();
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skuVisible, setSkuVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingRawMaterials, setLoadingRawMaterials] = useState(true);

    const token = localStorage.getItem('token');

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
                setSelectedCategories(productData.category); // Assuming these are IDs or labels
            } catch (error) {
                toast.error("Error fetching product: " + error.message);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddVariant = () => {
        setVariants([...variants, {
            size: '',
            firmness: '',
            price: '',
            weight: '',
            color: '',
            childName: '',
            rawMaterials: [{ material: '', quantity: '', unit: '' }],
            tags: []
        }]);
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
        const newVariants = [...variants];
        newVariants[variantIndex].rawMaterials.splice(materialIndex, 1);
        setVariants(newVariants);
    };

    const handleRawMaterialChange = (variantIndex, materialIndex, field, value) => {
        setVariants(prevVariants => {
            const updatedVariants = [...prevVariants];

            if (field === 'material') {
                const selectedMaterial = rawMaterials.find(raw => raw.material === value);
                if (selectedMaterial) {
                    updatedVariants[variantIndex].rawMaterials[materialIndex] = {
                        material: selectedMaterial.material,
                        quantity: updatedVariants[variantIndex].rawMaterials[materialIndex].quantity,
                        unit: selectedMaterial.measuringUnit,
                    };
                }
            } else {
                updatedVariants[variantIndex].rawMaterials[materialIndex][field] = value;
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
                selectedVariant.tags.push(tagToAdd.name);
                setVariants(newVariants);
            }
        }
    };

    const handleRemoveTag = (index, tagToRemove) => {
        const newVariants = [...variants];
        const selectedVariant = newVariants[index];
        selectedVariant.tags = selectedVariant.tags.filter(tag => tag !== tagToRemove);
        setVariants(newVariants);
    };

    const handleCategoryChange = (selectedOptions) => {
        const categoryValues = selectedOptions.map(option => option.value); // Assuming you are using IDs here
        setSelectedCategories(categoryValues);
    };

    const validateInputs = () => {
        for (const variant of variants) {
            if (!variant.firmness || !variant.price || !variant.weight ||
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
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
                parentName,
                variants,
                name,
                description,
                category: selectedCategories,
            });

            setSku(response.data.sku);
            setSkuVisible(true);
            toast.success("Product updated successfully!");
            navigate('/productlist');
            resetForm();

        } catch (error) {
            toast.error("Error updating product: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tags`);
                setAvailableTags(response.data);
            } catch (error) {
                console.error("There was an error fetching tags!", error);
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const categoryOptions = response.data.map(category => ({
                    value: category._id, // Assuming category ID is _id
                    label: category.name,
                }));
                setCategories(categoryOptions);
            } catch (error) {
                console.error("There was an error fetching categories!", error);
                toast.error("Error fetching categories: " + error.message);
            } finally {
                setLoadingCategories(false); // Stop loading after fetching
            }
        };

        fetchCategories();
    }, [token]);
console.log(selectedCategories)
    useEffect(() => {
        const fetchRawMaterials = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/raw-materials`);
                setRawMaterials(response.data);
            } catch (error) {
                console.error('Error fetching raw materials:', error);
            } finally {
                setLoadingRawMaterials(false); // Stop loading after fetching
            }
        };

        fetchRawMaterials();
    }, []);

    const resetForm = () => {
        setParentName('');
        setVariants([{
            size: '',
            firmness: '',
            price: '',
            weight: '',
            color: '',
            childName: '',
            rawMaterials: [{ material: '', quantity: '', unit: '' }],
            tags: []
        }]);
        setName('');
        setDescription('');
        setSkuVisible(false);
        setSelectedCategories([]);
        setAvailableTags([]); // Reset selected tags if needed
    };

    return (
        <div className="container w-full bg-navbar ml-10 mr-10  mx-auto mt-5 px-4 max-h-[80vh] overflow-y-auto">
            <ToastContainer />
            <h2 className="text-2xl font-bold text-center mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 ">
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
                        <label className="block text-gray-700 font-semibold">Product Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="md:col-span-1">
                      
                        <label htmlFor="category-select" className="block  text-gray-700 font-semibold">
                            Select a Category
                        </label>
                        {categories.length > 0 ? (
                 <Select
                 isMulti
                 name="categories"
                 options={categories}
                 className="basic-multi-select mt-2"
                 classNamePrefix="select"
                 onChange={handleCategoryChange}
                 value={categories.filter(cat => selectedCategories.includes(cat.value))}
                 isLoading={loadingCategories}
             />
            ) : (
                <p>Loading categories...</p>
            )}
                    </div>
                </div>

                <div className="mt-5">
                    <h3 className="text-lg font-bold">Variants:</h3>
                    {variants.map((variant, index) => (
                        <div key={index} className="border border-gray-300 p-4 rounded-md mt-2">
                            <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-gray-700 font-semibold">Child Name:</label>
    <input
      type="text"
      value={variant.childName}
      onChange={(e) => handleVariantChange(index, 'childName', e.target.value)}
      required
      className="mt-1 p-2 border border-gray-300 rounded w-full"
    />
  </div>
  <div>
    <label htmlFor={`height-${index}`} className="block text-sm font-semibold text-gray-700">
        Height
    </label>
    <input
        id={`height-${index}`}
        type="number"
        placeholder="Height"
        value={variant.height || ''} // Set initial value as empty if undefined
        onChange={(e) => handleVariantChange(index, 'height', e.target.value)}
        required
        className="p-2 border border-gray-300 rounded w-full mt-1"
    />
</div>

<div>
    <label htmlFor={`width-${index}`} className="block text-sm font-semibold text-gray-700">
        Width
    </label>
    <input
        id={`width-${index}`}
        type="number"
        placeholder="Width"
        value={variant.width || ''} 
        onChange={(e) => handleVariantChange(index, 'width', e.target.value)}
        required
        className="p-2 border border-gray-300 rounded w-full mt-1"
    />
</div>

<div>
    <label htmlFor={`length-${index}`} className="block text-sm font-semibold text-gray-700">
        Length
    </label>
    <input
        id={`length-${index}`}
        type="number"
        placeholder="Length"
        value={variant.length || ''} 
        onChange={(e) => handleVariantChange(index, 'length', e.target.value)}
        required
        className="p-2 border border-gray-300 rounded w-full mt-1"
    />
</div>

  <div>
    <label className="block text-gray-700 font-semibold">Firmness:</label>
    <select
    value={variant.firmness}
    onChange={(e) => handleVariantChange(index, 'firmness', e.target.value)}
    required
    className="p-2 border border-gray-300 rounded w-full"
>
    <option value="">Select firmness</option>
    <option value="Ultra Plush">Ultra Plush</option>
    <option value="Plush">Plush</option>
    <option value="Medium">Medium</option>
    <option value="Firm">Firm</option>
    <option value="Extra Firm">Extra Firm</option>
</select>
  </div>
  <div>
    <label className="block text-gray-700 font-semibold">Price:</label>
    <input
      type="number"
      value={variant.price}
      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
      required
      className="mt-1 p-2 border border-gray-300 rounded w-full"
    />
  </div>
  <div>
    <label className="block text-gray-700 font-semibold">Weight:</label>
    <input
      type="number"
      value={variant.weight}
      onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
      required
      className="mt-1 p-2 border border-gray-300 rounded w-full"
    />
  </div>
  {/* <div>
    <label className="block text-gray-700 font-semibold">Color:</label>
    <select
      value={variant.color}
      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
      required
      className="mt-1 p-2 border border-gray-300 rounded w-full"
    >
      <option value="">Select a color</option>
      {colors.map((color) => (
        <option key={color} value={color}>
          {color}
        </option>
      ))}
    </select>
  </div> */}
  {/* <div>
    <label className="block text-gray-700 font-semibold">SKU:</label>
    <input
      type="text"
      value={variant.SKU}
      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
      required
      className="mt-1 p-2 border border-gray-300 rounded w-full"
    />
  </div> */}
</div>


<div>
  <h4 className="mt-4 text-md font-semibold">Raw Materials:</h4>
  {variant.rawMaterials.map((material, materialIndex) => (
    <div key={materialIndex} className="mt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Material:</label>
          <select
            value={material.material}
            onChange={(e) => handleRawMaterialChange(index, materialIndex, 'material', e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          >
            <option value="">Select a material</option>
            {rawMaterials.map((rawMaterial) => (
              <option key={rawMaterial._id} value={rawMaterial.material}>
                {rawMaterial.material}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Quantity:</label>
          <input
            type="number"
            value={material.quantity}
            onChange={(e) => handleRawMaterialChange(index, materialIndex, 'quantity', e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Unit:</label>
          <input
            type="text"
            value={material.unit}
            onChange={(e) => handleRawMaterialChange(index, materialIndex, 'unit', e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
      </div>

      {/* Flex container to align buttons in one line */}
      <div className="flex space-x-2  mt-4">
      <button
          type="button"
          onClick={() => handleAddRawMaterial(index)}
          className="bg-blue-500 text-white p-2 hover:text-blue-700"
        >
          Add Raw Material
        </button>
        {materialIndex > 0 && (
          <button
            type="button"
            onClick={() => handleRemoveRawMaterial(index, materialIndex)}
            className="bg-red-500 text-white p-2 hover:text-red-700"
          >
            Remove Raw Material
          </button>
        )}
       
      </div>
    </div>
  ))}
</div>



                           <h4 className="mt-4 text-md font-semibold">Tags:</h4>
<select
    value={availableTags}  // Make sure to handle this state separately
    onChange={(e) => handleTagChange(index, e)}
    className="mt-1 p-2 border border-gray-300 rounded w-full"
>
    <option value="">Select a tag</option>
    {availableTags.map(tag => (
        <option key={tag._id} value={tag._id}>{tag.name}</option> // Use tag._id for unique value
    ))}
</select>

<div className="mt-2">
{variant.tags.length > 0 ? (
                                variant.tags.map((tag, tagIndex) => (
                                    // Render each selected tag with a remove button.
                                    <span key={tagIndex} className="inline-block bg-gray-200 rounded-full px-[8px] py-[5px] text-sm mr-[5px] mt-[5px]">
                                        {tag}
                                        {/* Remove Tag Button */}
                                        <button 
                                            type='button' 
                                            onClick={() => handleRemoveTag(index, tag)} 
                                            className='ml-[5px] text-red-[500]'
                                        >
                                            &times;
                                        </button> 
                                    </span> 
                                ))
    ) : (
        <p>No tags available</p>
    )}
</div>

       


                            <button
                                type="button"
                                onClick={() => handleRemoveVariant(index)}
                                className="mt-4 bg-red-500 text-white p-2 rounded"
                            >
                                Remove Variant
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddVariant}
                        className="mt-4 bg-blue-500 text-white p-2 rounded"
                    >
                        Add Variant
                    </button>
                </div>
                <div className="flex justify-end w-full">
    <button
        type="submit"
        className="mt-6 bg-green-500 text-white p-3 rounded w-48"
        disabled={loading}
    >
        {loading ? 'Updating Product...' : 'Update Product'}
    </button>
</div>
            </form>
        </div>
    );
};

export default EditProduct;
