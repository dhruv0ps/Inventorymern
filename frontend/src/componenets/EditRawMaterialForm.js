import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditRawMaterialForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [material, setMaterial] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [measuringUnit, setMeasuringUnit] = useState('in');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRawMaterial = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/raw-materials/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const rawMaterial = response.data;
                setMaterial(rawMaterial.material);
                setDescription(rawMaterial.description);
                setMeasuringUnit(rawMaterial.measuringUnit);
                setImagePreview(rawMaterial.imageUrl);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch raw material data');
            }
        };

        fetchRawMaterial();
    }, [id, token]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditRawMaterial = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        formData.append('material', material);
        formData.append('description', description);
        if (image) formData.append('image', image);
        formData.append('measuringUnit', measuringUnit);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/raw-materials/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 204) {
                toast.success('Raw material updated successfully');
                navigate('/rawmaterial');
            } else {
                toast.error(`Unexpected status code: ${response.status}`);
            }
        } catch (err) {
            console.error('Error updating raw material:', err);
            setError(err.response?.data?.message || 'Failed to update raw material');
            toast.error('Failed to update raw material');
        }
    };

    const onCancel = () => {
        navigate('/raw-materials');  // Navigate back to raw materials list
    };

    return (
        <div className="container w-2/6 mx-auto mt-5 px-4">
            <form onSubmit={handleEditRawMaterial} className="bg-gray-100 p-6 rounded-md shadow-md">
                <div className="form-group mb-4">
                    <label htmlFor="material-name" className="block mb-1 font-semibold">Material</label>
                    <input
                        type="text"
                        id="material-name"
                        placeholder="Enter material name"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)} 
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                        required
                    />
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="material-description" className="block mb-1 font-semibold">Description</label>
                    <input
                        type="text"
                        id="material-description"
                        placeholder="Enter material description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center justify-center w-full">
                    <label 
                        htmlFor="dropzone-file" 
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition duration-300"
                    >
                        <span className="text-center font-semibold mb-2">Upload Raw Material Image</span>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Uploaded Preview" className="h-auto max-h-32 object-cover mb-2" />
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
                            id="dropzone-file" 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label htmlFor="measuring-unit" className="block mb-1 font-semibold">Measuring Unit</label>
                    <select
                        id="measuring-unit"
                        value={measuringUnit}
                        onChange={(e) => setMeasuringUnit(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="Inches">Inches</option>
                        <option value="Ounces">Ounces</option>
                        <option value="Kilograms">Kilograms</option>
                    </select>
                </div>

                <button type="submit" className='bg-blue-500 text-white p-[12px] rounded w-full'>
                    Update Raw Material
                </button>

                <button type='button' onClick={onCancel} className='bg-red-500 text-white p-[12px] rounded w-full mt-[10px]'>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditRawMaterialForm;
