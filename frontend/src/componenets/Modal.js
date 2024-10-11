import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit, formData, handleFormChange, handleImageChange }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Edit Raw Material</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">Material Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleFormChange} 
                            className="border rounded w-full py-2 px-3" 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleFormChange} 
                            className="border rounded w-full py-2 px-3" 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="measuringUnit">Measuring Unit</label>
                        <select 
                            id="measuringUnit" 
                            name="measuringUnit" 
                            value={formData.measuringUnit} 
                            onChange={handleFormChange} 
                            className="border rounded w-full py-2 px-3" 
                            required 
                        >
                            <option value="" disabled>Select a unit</option>
                            <option value="inches">Inches</option>
                            <option value="ounces">Ounces</option>
                            <option value="kilograms">Kilograms</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="image">Upload Image (optional)</label>
                        <input 
                            type="file" 
                            id="image" 
                            name="image" 
                            onChange={handleImageChange} 
                            className="border rounded w-full py-2 px-3" 
                        />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;


