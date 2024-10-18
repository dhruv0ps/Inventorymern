import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const RawMaterialForm = ({ onRawMaterialAdded }) => {
    const [material, setMaterial] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [measuringUnit, setMeasuringUnit] = useState("Inches");
    const token = localStorage.getItem('token');
    const navigate = useNavigate()
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
           
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (jpg, png, gif).');
                e.target.value = ''; 
                return;
            }
    
            
            const maxSize = 1 * 1024 * 1024; 
            if (file.size > maxSize) {
                alert('File size exceeds 1 MB. Please upload a smaller file.');
                e.target.value = ''; 
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddRawMaterial = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('material', material);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('measuringUnit', measuringUnit);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/raw-materials`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Raw material added successfully');
            onRawMaterialAdded(response.data);
            resetForm();
            navigate("/rawmaterial")
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add raw material');
        }
    };

    const resetForm = () => {
        setMaterial('');
        setDescription('');
        setImage(null);
        setImagePreview(null);
        setMeasuringUnit('');
    };

    // Inline styles
    const formStyle = {
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        maxHeight: '500px',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px',
        boxSizing: 'border-box',
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        transition: 'background-color 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#0056b3',
    };

    return (
        <>
            <form onSubmit={handleAddRawMaterial} style={formStyle} className="mb-8">
                <div className="form-group mb-4">
                    <label htmlFor="material-name" className="block mb-1 font-semibold">Material Name</label>
                    <input
                        type="text"
                        id="material-name"
                        placeholder="Enter material name"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="material-description" className="block mb-1 font-semibold">Material Description</label>
                    <input
                        type="text"
                        id="material-description"
                        placeholder="Enter material description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>

                
                <div className="mb-4">
    <label 
        className="block text-lg font-semibold mb-2" // Label above the upload box
    >
        Upload Raw Material Image
    </label>
    <label 
        htmlFor="image-upload" 
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition duration-300"
    >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {imagePreview ? (
                <img 
                    src={imagePreview} 
                    alt="Uploaded Preview" 
                    className="h-auto max-h-32 object-cover mb-2" 
                />
            ) : (
                <>
                    <svg 
                        className="w-8 h-8 mb-4 text-gray-500" 
                        aria-hidden="true" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 20 16"
                    >
                        <path 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2l2 2"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                </>
            )}
        </div>
        <input 
            id="image-upload"
            type="file"
            accept=".svg,.png,.jpg,.gif"
            onChange={(e) => handleImageChange(e)} // Ensure you have a function to handle image upload
            className="hidden" // Hide the default file input
        />
    </label>
</div>

                <div className="mb-4">
                    <label htmlFor="measuring-unit" className="block mb-1 font-semibold">Measuring Unit</label>
                    <select
                        id="measuring-unit"
                        value={measuringUnit}
                        onChange={(e) => setMeasuringUnit(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="Inches">Inches</option>
                        <option value="Ounces">Ounces</option>
                        <option value="Kilograms">Kilograms</option>
                        <option value="Pieces">Pieces</option>
                    </select>
                </div>

                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
                >
                    Add Raw Material
                </button>
            </form>
            <ToastContainer />
        </>
    );
};

export default RawMaterialForm;
