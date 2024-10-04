import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; 

const RawMaterialsList = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        measuringUnit: '',
        imageFile: null,
    });

    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        fetchRawMaterials();
    }, []); 

    const fetchRawMaterials = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/raw-materials');
            setRawMaterials(response.data);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

   
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

   
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => formDataToSubmit.append(key, formData[key]));

        try {
            if (editingProductId) {
                await axios.put(`http://localhost:5000/api/raw-materials/${editingProductId}`, formDataToSubmit);
                alert('Raw Material updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/raw-materials', formDataToSubmit);
                alert('Raw Material added successfully!');
            }
            fetchRawMaterials(); 
            setIsModalOpen(false); 
            setEditingProductId(null); 
            setFormData({ name:'', description:'', measuringUnit:'', imageFile:null }); 
        } catch (error) {
            console.error('Error saving raw material:', error);
        }
    };

    
    const handleEditClick = (rawMaterial) => {
        setEditingProductId(rawMaterial._id);
        setFormData({
            name: rawMaterial.name,
            description: rawMaterial.description,
            measuringUnit: rawMaterial.measuringUnit,
            imageFile: null 
        });
        setIsModalOpen(true); 
    };

    
    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this raw material?")) {
            try {
                await axios.delete(`http://localhost:5000/api/raw-materials/${id}`);
                alert('Raw Material deleted successfully!');
                fetchRawMaterials(); 
            } catch (error) {
                console.error('Error deleting raw material:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="text-2xl font-bold mb-4">Raw Materials</div>

            <button 
                onClick={() => { setIsModalOpen(true); setEditingProductId(null); }} 
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
            >
                Add New Raw Material
            </button>

           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rawMaterials.map((rawMaterial) => (
                    <div key={rawMaterial._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img src={`http://localhost:5000/${rawMaterial.image}`} alt={rawMaterial.name} className='w-full h-[200px] object-cover' />
                        <div className="p-4">
                            <h3 className="text-lg font-bold">{rawMaterial.name}</h3>
                            <p className="text-gray-600">{rawMaterial.description}</p>
                            <p className="text-gray-500">Measuring Unit: {rawMaterial.measuringUnit}</p>
                            <div className="mt-4">
                                <button onClick={() => handleEditClick(rawMaterial)} className='mr-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded'>Edit</button>  
                                <button onClick={() => handleDeleteClick(rawMaterial._id)} className='px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded'>Delete</button>  
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            
            {isModalOpen && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleSubmitForm} 
                    formData={formData} 
                    handleFormChange={handleInputChange} 
                />
            )}
        </div>  
     );  
};  

export default RawMaterialsList;  