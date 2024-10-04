import React, { useState } from 'react';
import axios from 'axios';

const RawMaterialForm = ({ onRawMaterialAdded }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [measuringUnit, setMeasuringUnit] = useState('in');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    
    const handleAddRawMaterial = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('measuringUnit', measuringUnit);

        try {
            const response = await axios.post('http://localhost:5000/api/raw-materials', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Raw material added successfully');
            onRawMaterialAdded(response.data);
            resetForm();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add raw material');
        }
    };

   
    const resetForm = () => {
        setName('');
        setDescription('');
        setImage(null);
        setImagePreview(null);
        setMeasuringUnit('in');
    };

    return (
        <form onSubmit={handleAddRawMaterial} className="mb-8 bg-white p-6 rounded-lg shadow-md">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Material Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-500 p-3 w-full rounded focus:outline-none focus:border-teal-500"
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Material Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-500 p-3 w-full rounded focus:outline-none focus:border-teal-500"
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="border border-gray-500 p-3 w-full rounded focus:outline-none focus:border-teal-500"
                    required
                />
                {imagePreview && <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover mt-2" />}
            </div>
            <div className="mb-4">
                <select
                    value={measuringUnit}
                    onChange={(e) => setMeasuringUnit(e.target.value)}
                    className="border border-gray-500 p-3 w-full rounded focus:outline-none focus:border-teal-500"
                >
                    <option value="in">Inches</option>
                    <option value="oz">Ounces</option>
                    <option value="kg">Kilograms</option>
                </select>
            </div>
            <button
                type="submit"
                className="bg-teal-500 text-white w-full py-3 rounded hover:bg-teal-600 transition-colors duration-300"
            >
                Add Raw Material
            </button>
        </form>
    );
};

export default RawMaterialForm;
